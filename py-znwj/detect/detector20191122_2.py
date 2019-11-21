#!/usr/bin/env python
# coding: utf-8

import paho.mqtt.client as mqtt

# host = '116.85.15.79'
host = 'localhost'
clientIdentifier = 'detect'
detect_topic = '/znwj/detect'
result_topic = '/znwj/detect/result'

# YOLO 类 实例 初始化；如：
# yolo = new YOLO（）

import colorsys

import numpy as np
from keras import backend as K
from keras.models import load_model
from keras.layers import Input
from PIL import Image, ImageDraw

from detect.yolo3.model import yolo_eval, yolo_body, tiny_yolo_body
from keras.utils import multi_gpu_model

import json, os
from keras.preprocessing import image


class YOLO(object):
    _defaults = {
        "model_path": 'logs/000/trained_weights_final20191122.h5',
        "anchors_path": 'model_data/yolo_anchors.txt',
        "classes_path": 'model_data/voc_classes.txt',
        "score": 0.15,  # scoce 0.3
        "iou": 0.55,  # ios 0.45
        # "model_image_size" : (608,608),
        "gpu_num": 1,
    }

    @classmethod
    def get_defaults(cls, n):
        if n in cls._defaults:
            return cls._defaults[n]
        else:
            return "Unrecognized attribute name '" + n + "'"

    def __init__(self, **kwargs):
        self.__dict__.update(self._defaults)  # set up default values
        self.__dict__.update(kwargs)  # and update with user overrides
        self.class_names = self._get_class()
        self.anchors = self._get_anchors()
        self.sess = K.get_session()
        self.boxes, self.scores, self.classes = self.generate()

    def _get_class(self):
        classes_path = os.path.expanduser(self.classes_path)
        with open(classes_path) as f:
            class_names = f.readlines()
        class_names = [c.strip() for c in class_names]
        return class_names

    def _get_anchors(self):
        anchors_path = os.path.expanduser(self.anchors_path)
        with open(anchors_path) as f:
            anchors = f.readline()
        anchors = [float(x) for x in anchors.split(',')]
        return np.array(anchors).reshape(-1, 2)

    def generate(self):
        model_path = os.path.expanduser(self.model_path)
        assert model_path.endswith('.h5'), 'Keras model or weights must be a .h5 file.'

        # Load model, or construct model and load weights.
        num_anchors = len(self.anchors)
        num_classes = len(self.class_names)
        is_tiny_version = num_anchors == 6  # default setting
        try:
            self.yolo_model = load_model(model_path, compile=False)
        except:
            self.yolo_model = tiny_yolo_body(Input(shape=(None, None, 3)), num_anchors // 2, num_classes) \
                if is_tiny_version else yolo_body(Input(shape=(None, None, 3)), num_anchors // 3, num_classes)
            self.yolo_model.load_weights(self.model_path)  # make sure model, anchors and classes match
        else:
            assert self.yolo_model.layers[-1].output_shape[-1] == \
                   num_anchors / len(self.yolo_model.output) * (num_classes + 5), \
                'Mismatch between model and given anchor and class sizes'

        print('{} model, anchors, and classes loaded.'.format(model_path))

        # Generate colors for drawing bounding boxes.
        hsv_tuples = [(x / len(self.class_names), 1., 1.)
                      for x in range(len(self.class_names))]
        self.colors = list(map(lambda x: colorsys.hsv_to_rgb(*x), hsv_tuples))
        self.colors = list(
            map(lambda x: (int(x[0] * 255), int(x[1] * 255), int(x[2] * 255)),
                self.colors))
        np.random.seed(10101)  # Fixed seed for consistent colors across runs.
        np.random.shuffle(self.colors)  # Shuffle colors to decorrelate adjacent classes.
        np.random.seed(None)  # Reset seed to default.

        # Generate output tensor targets for filtered bounding boxes.
        self.input_image_shape = K.placeholder(shape=(2,))
        if self.gpu_num >= 2:
            self.yolo_model = multi_gpu_model(self.yolo_model, gpus=self.gpu_num)
        boxes, scores, classes = yolo_eval(self.yolo_model.output, self.anchors,
                                           len(self.class_names), self.input_image_shape,
                                           score_threshold=self.score, iou_threshold=self.iou)
        return boxes, scores, classes


yolo = YOLO()

#  CX,BS模型加载
cx_bs_model_path = 'logs/000//ResNet50_best.h5'
model_cx_bs = load_model(cx_bs_model_path)


def predict_cx_bs(img_path, model):
    img = image.load_img(img_path, target_size=(224, 224))
    x = image.img_to_array(img)
    x = np.expand_dims(x, axis=0)
    preds = model.predict(x)
    return preds, img


def enumerate_class(out_classes):
    name = ['毛丝', '夹丝', '成型', '油污', '毛丝2']
    detect_name = ''
    for i, c in reversed(list(enumerate(out_classes))):
        detect_name = str(detect_name) + '_' + str(name[c])
    return detect_name


def on_connect(client, userdata, flags, rc):
    print("Connected with result code: " + str(rc))
    client.subscribe(detect_topic, qos=1)


def on_message(client, userdata, msg):
    code = msg.payload.decode("utf-8")
    print(msg.topic + " " + code)
    if msg.topic == detect_topic:
        # 拍照丝锭的条码
        # 通过条码得出抓图后的路径
        # 调用YOLO实例的 detect 方法 得出 异常 数据  backData
        # 把backData传回我
        path = "/znwj_dev/db" + code + '/original'
        outdir = "/znwj_dev/db" + code + '/defect/'
        out_file_name = []
        out_label = []
        class_names = ['MS', 'JS', 'CX', 'YW', 'N_MS']
        for jpgfile in os.listdir(path):
            camera_num = jpgfile.index('_')
            # 判断属于哪个摄像头，，文件命名：code+'_'+'摄像头编号'
            # 判断毛丝、油污、成型
            if jpgfile.split('.')[0][camera_num + 1:] in (1, 2, 3, 4, 5, 6, 7):

                img1 = Image.open(path + '/' + jpgfile)
                # print(path+'/'+jpgfile)
                img1 = img1.convert('RGB')
                model_image_size = (416, 416)
                img, out_boxes, out_classes = yolo.detect_image(img1, model_image_size)

                if len(out_boxes) > 0:
                    label = enumerate_class(out_classes)
                    out_label.append(label[1:])
                    name = ''
                    for i, c in reversed(list(enumerate(out_classes))):
                        name = str(name) + '_' + str(class_names[out_classes[c]])
                    img.save(os.path.join(outdir, os.path.basename('defect_' + jpgfile[:-4] + name + '.jpg')))
                    out_file_name.append('defect_' + jpgfile[:-4] + name + '.jpg')
                else:
                    model_image_size = (608, 608)
                    img, out_boxes, out_classes = yolo.detect_image(img1, model_image_size)

                    if len(out_boxes) > 0:
                        label = enumerate_class(out_classes)
                        out_label.append(label[1:])
                        name = ''
                        for i, c in reversed(list(enumerate(out_classes))):
                            name = str(name) + '_' + str(class_names[out_classes[c]])
                        out_file_name.append('defect_' + jpgfile[:-4] + name + '.jpg')
                        img.save(os.path.join(outdir, os.path.basename('defect_' + jpgfile[:-4] + name + '.jpg')))

            else:

                # 判断BS和CX
                if False:
                    pred, img_cx_bs = predict_cx_bs(path + jpgfile, model_cx_bs)
                    temp = pred[0, :]
                    index = np.argmax(temp)
                    if index == 2:
                        draw = ImageDraw.Draw(img)
                        draw.text((20, 20), 'BS', fill=(0, 255, 0))
                        out_label.append('绊丝')
                        out_file_name.append('defect_' + jpgfile[:-4] + '_BS.jpg')
                        img_cx_bs.save(os.path.join(outdir, os.path.basename('defect_' + jpgfile[:-4] + '_BS.jpg')))


                else:
                    pred, img_cx_bs = predict_cx_bs(path + jpgfile, model_cx_bs)
                    temp = pred[0, :]
                    index = np.argmax(temp)
                    if index == 0:
                        draw = ImageDraw.Draw(img_cx_bs)
                        draw.text((20, 20), 'CX', fill=(0, 255, 0))
                        out_label.append('成型')
                        out_file_name.append('defect_' + jpgfile[:-4] + '_CX.jpg')
                        img_cx_bs.save(os.path.join(outdir, os.path.basename('defect_' + jpgfile[:-4] + '_CX.jpg')))

        result = json.dumps({'code': code
                                , 'detectExceptionInfos': [
                {
                    'exception': out_label,
                    'exceptionImageFileNames': out_file_name

                }
            ]})
        client.publish(result_topic, result)
        print('publish result %s', result)


client = mqtt.Client(clientIdentifier)
client.on_connect = on_connect
client.on_message = on_message
client.connect(host, 1883)

# 保持连接 程序不会退出
client.loop_forever()
