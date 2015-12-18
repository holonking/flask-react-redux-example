import os
import time

from flask import Flask
from flask_restful import Resource, Api


DEBUG = os.environ.get('BACKEND_DEBUG') == 'on'


app = Flask(__name__)
api = Api(app)

class HelloWorld(Resource):
    def get(self):
        time.sleep(2)
        return {'test_msg': 'hello world'}

api.add_resource(HelloWorld, '/api/hello')

def run():
    app.run(debug=DEBUG, port=3001)

if __name__ == '__main__':
    run()
