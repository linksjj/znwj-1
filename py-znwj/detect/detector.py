import json

import yaml


class Detector(object):
    def __init__(self, config_file):
        config = yaml.load(open(config_file))
        # 伪代码 需修改
        # self.__detector1 = Detector1(config)
        # self.__detector2 = Detector2(config)

    def detect(self, code):
        infos1 = self.__detector1.detect(code);
        infos2 = self.__detector2.detect(code);
        return json.dumps({
            'code': code,
            'detectExceptionInfos': infos1 + infos2
        })
