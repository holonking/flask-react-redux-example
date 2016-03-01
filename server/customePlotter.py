from jplot import JPlot 
import sqlite3
import numpy as np

def getSecurity(secNum):
	conn=sqlite3.connect("test.db")
	cur=conn.cursor()
	limit=500000
	outData=[]
	command="select * from tick_data where stock="+str(secNum) +" limit "+str(limit)
	cur.execute(command)
	rawData=cur.fetchall()
	for item in rawData:
		outItem={'time':item[0],'secNum':item[1],'o':item[2],'c':item[3],'h':item[4],'l':item[5],'v':item[6]}
		outData.append(outItem)
	return outData
def interpolateCandle(candles,step):
	outData=[]
	counter=step
	o=c=h=l=v=0
	for i in range(len(candles)):
		item=candles[i]
		if(counter==step):
			c=item['c']
			if i>0 :
				val={'secNum':item['secNum'],'time':item['time'],'o':o,'c':c,'h':h,'l':l,'v':v}
				outData.append(val)
			h=item['h']
			l=item['l']
			o=item['o']
			v=item['v']
			counter=0
		else:
			counter+=1
			v+=item['v']
			if item['h']>h: h=item['h']
			if item['l']<l: l=item['l']
	return outData
def getCandleAverage(candles):
	outData=[]
	for item in candles:
		#val=(item[2]+item[3]+item[4]+item[5])/4
		val=(item['o']+item['c']+item['h']+item['l'])/4
		outData.append(round(val,3))
	return outData	
def getSMA(data,num):
	weights=np.reapeat(1.0,num)/num
	sma=np.convolve(data,weights,'valid')
	return sma.round(3)
def getEMA(data,num):
	weights=np.exp(np.linspace(-1.0,0.,num))
	weights/=weights.sum()
	a=np.convolve(data,weights)[:len(data)]
	a[:num]=a[num]
	a=a.round(3)
	a=a.tolist()
	return a
def getTypeFromJSON(json,type):
	outData=[]
	for i in json:
		outData.append(i[type])
	return outData
def getIntersectIndice(set1,set2):
	length=len(set1)
	outData=[]
	for i in range(1,length):
		d1p=set1[i-1]
		d1=set1[i]
		d2p=set2[i-1]
		d2=set2[i]

		cond=d1p>d2p
		if (d1>d2)!=cond:
			outData.append(i)
	return outData
def getPoints(data,indice):
	outData=[]
	for i in range(len(indice)):
		outData.append({'x':indice[i],'y':data[indice[i]]})
	return outData
def getAllPoints(data):
	outData=[]
	for i in range(len(data)):
		outData.append({'x':i,'y':data[i]})
	return outData


class CustomRunner:

	def __init__(self):
		#setup dataBase connection
		self.server=JPlot(3001)


	def run(self):
		print('custom run()')
		#prepare data
		candles=getSecurity(600000)
		candles=interpolateCandle(candles,60)
		average=getCandleAverage(candles)
		close=getTypeFromJSON(candles,'c')
		ma5=getEMA(close,5)
		ma10=getEMA(close,10)
		ma20=getEMA(close,20)

		#sets the scale of the canvas using the base data
		canvas=self.server
		canvas.setData(candles)
		
		#draw all graphs
		canvas.drawPoly(average,{'color':'orange','name':'average'})
		canvas.drawPoly(close,{'color':'green','name':'close'})
		canvas.drawPoly(ma5,{'color':'red','name':'ma5'})
		canvas.drawPoly(ma10,{'color':'blue','name':'ma10'})
		canvas.drawPoly(ma20,{'color':'#99ccff','name':'ma20'})

		#draw intersctions of ma5 and ma10
		indices=getIntersectIndice(ma5,ma20)
		pts=getPoints(close,indices) #points are drawn on the 'close' graph
		#pts=getAllPoints(close)
		canvas.drawPoints(pts,{'color':'green','fill':'blue'})

		#test draw line
		l1=[[20,18.3,40,18.5,300]]
		#canvas.drawLines(l1,{'color':'red','name':'testTrade'})


	#end run()

	#initialize the server and connect
	def connect(self):
		self.server.setCustomRunner(self)
		#self.server.test()
		self.server.connect()



if __name__ == '__main__':
	c=CustomRunner()
	c.connect()





