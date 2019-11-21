#!/usr/bin/python3
# coding: utf-8

import paho.mqtt.client as mqtt

from detect.detector import Detector

HOST = 'localhost'
CLIENT_IDENTIFIER = 'detect'

DETECT_TOPIC = '/znwj/detect'
DETECT_RESULT_TOPIC = '/znwj/detect/result'
DETECTOR = Detector(config_file='/home/znwj_dev/config.yml')


def on_connect(client, userdata, flags, rc):
    print("Connected with result code: " + str(rc))
    client.subscribe(DETECT_TOPIC, qos=1)


def on_message(client, userdata, msg):
    if msg.topic == DETECT_TOPIC:
        code = msg.payload.decode("utf-8")
        result = DETECTOR.detect(code)
        client.publish(DETECT_RESULT_TOPIC, result)


CLIENT = mqtt.Client(CLIENT_IDENTIFIER)
CLIENT.on_connect = on_connect
CLIENT.on_message = on_message
CLIENT.connect(HOST, 1883)
CLIENT.loop_forever()
