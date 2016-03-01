from customePlotter import *

sec=getSecurity(600000)
sec=interpolateCandle(sec,60)
print(sec)

c=getTypeFromJSON(sec,'c')
ma5=getEMA(c,5)
ma10=getEMA(c,10)
indice=getIntersectIndice(ma5,ma10)

ma5=ma5.tolist()
ma10=ma10.tolist()

print(indice)
print('ma05[13]:'+str(ma5[13])+'ma05[14]:'+str(ma5[14]))
print('ma10[13]:'+str(ma10[13])+'ma10[14]:'+str(ma10[14]))