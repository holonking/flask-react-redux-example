import os

class CommonConfig:
    TESTING = False


class DevConfig(CommonConfig):
    DEBUG = True

    # user-defined configs
    host = '127.0.0.1'
    port = 3001

class ProductionConfig(CommonConfig):
    DEBUG = False
