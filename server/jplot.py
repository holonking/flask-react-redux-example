# set this to 'threading', 'eventlet', or 'gevent'
#async_mode = 'threading' 
import eventlet
import time
from threading import Thread
from flask import Flask, render_template
import socketio
import eventlet

class JPlot:
    def __init__(self, port):
        self.port=port
        self.namespace='/api'
        self.customRunner=None

    def setNamespace(self,namespace):
        self.namespace=namespace

    def runOnConnect(self):
        print('JPlot.runOnConnect')

    def setCustomRunner(self,c):
        self.customRunner=c

    def test(self):
            if self.customRunner!=None:
                self.customRunner.run()
            else: print('no customRunner')

    #connects socket.IO and set socketIO function decorators
    def connect(self):
        print('at JPlot.connection')

        port=self.port
        sio = socketio.Server(logger=True, async_mode='eventlet')
        self.sio=sio
        app = Flask(__name__)
        app.wsgi_app = socketio.Middleware(sio, app.wsgi_app)
        app.config['SECRET_KEY'] = 'secret!'

        #######################################
        #assign socket.io function decorations
        #######################################
        @app.route(self.namespace)
        def atApi():
            print('at api')

        @sio.on('connect')
        def test_connect(sid, environ):
            print('connection established')
            sio.emit('server response', {'data': 'Server Connected', 'count': 0}, room=sid,
             namespace=self.namespace)
            

        @sio.on('client startup', namespace=self.namespace)
        def client_startUp(sid, message):
            print('client startup, got message ',message['data'])
            sio.emit('server response', {'data': '$ test message from server.on (client starup)'}, namespace=self.namespace)
            # run custom runner run() function
            if self.customRunner!=None:
                self.customRunner.run()

        @sio.on('client event', namespace=self.namespace)
        def test_message(sid, message):
            print('got client message')
            #print('client event got:'+message['data'])
            sio.emit('server response', {'data': '$'+message['data']}, room=sid, namespace=self.namespace)

        @sio.on('disconnect request', namespace=self.namespace)
        def disconnect_request(sid):
            sio.disconnect(sid)

        #######################################
        # start socket.io connection
        #######################################
        eventlet.wsgi.server(eventlet.listen(('', port)), app)

     
    #end JPlot.connect()

    def setData(self,d):
        print('callong setData')
        self.sio.emit('server set data',{'data':d},namespace=self.namespace)
    #end JPlot.setData()

    #send data to draw a polyline
    #data format: [{x:0,y:0},{x:1,y1}]
    def drawPoly(self,d,attr):
        print('server draw poly')
        self.sio.emit('server draw poly',{'data':d,'attr':attr},namespace=self.namespace)
    #end JPlot.drawPoly()

    #send data to draw points
    #data format: [{x:0,y:0},{x:1,y1}]
    def drawPoints(self,d,attr):
        print('server draw points')
        self.sio.emit('server draw points',{'data':d,'attr':attr},namespace=self.namespace)
    #end JPlot.drawPoints()

    #send data to draw candles
    #data format: [{x:0,y:0},{x:1,y1}]
    def drawCandles(self,d,attr):
        print('server draw candles')
        self.sio.emit('server draw candles',{'data':d,'attr':attr},namespace=self.namespace)
    #end JPlot.drawPoints()

    #send data to draw lines
    #data format: [{x:0,y:0},{x:1,y1}]
    def drawLines(self,d,attr):
        self.sio.emit('server draw lines',{'data':d,'attr':attr},namespace=self.namespace)
    #end JPlot.drawPoints()


#end class JPlot









# @sio.on('disconnect')
# def test_disconnect(sid):
#     print('Client disconnected')


if __name__ == '__main__':
    plotter=JPlot(3001)
    plotter.connect()
