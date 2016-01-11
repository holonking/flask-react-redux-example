import os
import time
import csv

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

class SSV(Resource):
	def get(self,secNum):
		number=secNum
		fileName="data/SH"+str(number)+".csv"
		readData=csv.reader(open(fileName))
		outData=[]
		for row in readData:
			outData.append(row)
		#print(outData[100])
		return outData

api.add_resource(SSV, '/api/SSV/<secNum>')




def run():
    app.run(host=Config.host, port=Config.port)

if __name__ == '__main__':
    run()
