import csv
import json


def getTime(strT):
	h=0
	m=0
	s=0
	if(len(strT)<6):
		h=strT[0]
		m=strT[1:3]
		s=strT[3:5]
	else:
		h=strT[0:2]
		m=strT[2:4]
		s=strT[4:6]
	return [h,m,s]

def getCandleFromTicks(fileName):

	readData=csv.reader(open(fileName))
	outData=[]


	lastHour=-1
	lastMin=-1
	lastSec=-1
	lastPrice=-1
	pO=-1
	pH=-1
	pL=-1
	pC=-1
	pV=0
	pT=-1

	tVolume=-1
	counter=-1

	outData=[]

	for row in readData:

		#print(line)
		time=getTime(row[0])
		tHour=time[0]
		tMin=time[1]
		tSec=time[2]
		tPrice=float(row[1])
		tBuyOrSell=row[2]
		tVolume=row[3]


		if(counter==-1):
			pO=pH=pL=pC=tPrice
		if(lastMin!=tMin and lastMin!=-1):
			
			pC=lastPrice
			pT=lastHour+":"+lastMin
			candle={'o':pO,'h':pH,'l':pL,'c':pC,'v':pV,'d':pT}
			#print(candle)
			outData.append(candle)

			pO=pH=pL=pC=tPrice
			counter=0
			#totalPrice=0
			pV=0
		
		#totalPrice+=tPrice
		pV+=int(tVolume)
		if(tPrice>pH):pH=tPrice
		if(tPrice<pL):pL=tPrice
		counter+=1


		lastHour=tHour
		lastMin=tMin
		lastSec=tSec
		lastPrice=tPrice

	return outData

number=600000
fileName="data/SH"+str(number)+".csv"
outData=getCandleFromTicks(fileName)



print(outData[10])








