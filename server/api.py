import os
import time

from flask import Flask
from flask_restful import Resource, Api

DEBUG = os.environ.get('BACKEND_DEBUG') == 'on'

if DEBUG:
    from config import DevConfig as Config
else:
    from config import ProductionConfig as Config


app = Flask(__name__)
app.config.from_object(Config)
api = Api(app)

class HelloWorld(Resource):
    def get(self):
        time.sleep(2)
        return {'test_msg': 'hello world'}

api.add_resource(HelloWorld, '/api/hello')

def run():
    app.run(host=Config.host, port=Config.port)

if __name__ == '__main__':
    run()
