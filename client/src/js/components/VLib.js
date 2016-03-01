var log=logger('VLib');

export default class VLib{
	static convertLinearToJSON(data){
		console.log("converLinearToJSON()");
		//console.log("@VLib.convertLinearToJSON process data=",data);
	    var outdata=[]
	    for(var i=0;i<data.length;i++)
	    {
	      var d={'x':i,'y':data[i]};
	      outdata.push(d);
	    }
	    console.log("dataConvertedTo");
	    return outdata;
	}
	/////////////////////////////////////
	///////   @static getMA   ///////////
	/////////////////////////////////////
	//parms:data=The linear data to get the MA
	//parms:num=the number of time units to calculate MA
	//get the moving average of num of time units
	static getMA(data,num){
		if(!data)log.debug('!data @VLib.getMA(data,num)');
		if(!num)log.debug('!num @VLib.getMA(data,num)');
		var outData=[];

		for(var i=0;i<data.length;i++)
		{
			var counter=1;//requires counter because factor is not always num!
			var total=VLib.getCandleAverage(data[i]);
			for(var j=1;j<=num;j++)
			{
				var index=i-j;
				if(index>0 & index<data.length)
				{
					total+=VLib.getCandleAverage(data[index]);
					counter=counter+1;
				}//end if
			}//end for j
			var average=total/counter
			var nd={y:average};
			outData.push(nd);
		}//end for i
		return outData;
	}//end getMA()
	static getCandleAverage(c)
	{
		return (c.o+c.c+c.h+c.l)/4 ;
	}

	/////////////////////////////////////
	///////   @static getReverse   //////
	/////////////////////////////////////
	//!not implemented; num is the num of difference to ommit the resversion
	static getCandleReverse(data,num){
		if(!data)log.debug('!data @VLib.getMA(data,num)');
		if(!num)log.debug('!num @VLib.getMA(data,num)');
		var outData=[];

		var trend=0; //-1:drop, 1:rise
		var lastTrend=0;
		var lastPrice=0;
		var lastPeak=0;
		var peak='flat';

		var addPeak=function(v,i){
			outData.push({x:i,y:v});
		};


		for(var i=0;i<data.length;i++)
		{
			var average=VLib.getCandleAverage(data[i]);
			if(average>lastPrice) trend=1; else if(average<lastPrice) trend=-1; else trend=0;

			if(i==0) {
				outData.push({x:i,y:average,p:peak});
				lastPeak=0;
			}//f(i==0)
			else if(i<data.length-1){
				var nextA=VLib.getCandleAverage(data[i+1]);
				var nextTrend=0;
				if(nextA>average) {nextTrend=1; peak='bot';}
				else if(nextA<average) {nextTrend=-1; peak='top';}
				else {nextTrend=0; peak='flat';}
				if(nextTrend!=trend)
					outData.push({x:i,y:average,p:peak});
			}//if(i<data.length)
			else if(i==data.length-1)
			{
				outData.push({x:i,y:average,p:peak});
			}
			console.log('162150 ['+i+']:'+peak);
			lastTrend=trend;
			lastPrice=average;
		}
		return outData;
	}


	/////////////////////////////////////
	///   @static getReverseFeatures   //
	/////////////////////////////////////
	//!not implemented; num is the num of data to look back, not implemeted
	static getCandleReverseFeatures(data,ma1,ma2,num,peakType){
		console.log('162150 getCandleReverseFeatures');

		var reverse=VLib.getCandleReverse(data,1);
		console.log('162150 reverse.len=',reverse.length);
		console.log('162150 reverse[0]=',reverse[0]);


		var dma1vMax=0;
		var dma1vMin=0;
		var dma1vAvg=0;

		var dma2vMax=0;
		var dma2vMin=0;
		var dma2vAvg=0;

		var macdMax=0;
		var macdMin=0;
		var macdAvg=0;

		var rd=function(d){return Math.round(d*1000)/1000;};

		var counter=0;
		for(var i=0;i<reverse.length;i++)
		{
			//set initial values
			if(i==0){
				var dma1vMax=dma1vMin=ma1[reverse[i].x+1].y-ma1[reverse[i].x].y;
				var dma2vMax=dma2vMin=ma2[reverse[i].x+1].y-ma2[reverse[i].x].y;
				var macdMax=macdMin=dma1vMax-dma2vMax;
			}
			else{
				//get the peak consition
				var peak=reverse[i].p;
				if(peakType==peak){
					counter+=1;
					//get the data before reverse
					var index=reverse[i].x-1;
					var dma1v0=ma1[index].y;
					var dma1v1=ma1[reverse[i].x].y;

					var dma1v=dma1v1-dma1v0;
					if  (dma1v>dma1vMax) dma1vMax=dma1v;
					else if(dma1v<dma1vMin) dma1vMin=dma1v;
					dma1vAvg+=dma1v;

					var dma2v0=ma2[index].y;
					var dma2v1=ma2[reverse[i].x].y;

					var dma2v=dma2v1-dma2v0;
					if(dma2v>dma2vMax) dma2vMax=dma2v;
					else if(dma2v<dma2vMax) dma2vMin=dma2v;
					dma2vAvg+=dma2v;

					var macdv=dma1v0-dma2v0;
					if(macdv>macdMax) macdMax=macdv;
					else if(macdv<macdMin) macdMin=macdv;
					macdAvg+=macdv;
				}
				console.log('162150 peak:',peak,' counter:',counter,' dma1v:',dma1v,' dam1vMax:',dma1vMax);
			}
		}
		macdAvg/=counter;
		dma1vAvg/=counter;
		dma2vAvg/=counter;



		var message=peakType+'--numSamples='+counter;
		message+='<br> dma1: <'+rd(dma1vMax)+', '+rd(dma1vAvg)+', '+rd(dma1vMin)+'>';
		message+='<br> dma2: <'+rd(dma2vMax)+', '+rd(dma2vAvg)+', '+rd(dma2vMin)+'>';
		message+='<br> macd: <'+rd(macdMax) +', '+rd(macdAvg) +', '+rd(macdMin) +'>';

		return message;

	}

	/////////////////////////////////////
	///   @static getReverseFeatures   //
	/////////////////////////////////////
	//do not use candle data
	//data must contain .y
	static strategy1(data,ma1,ma2,dma1B,dma2B,macdB,dma1S,dma2S,macdS,offset)
	{
		var outData=[];
		var buyData=[];
		var saleData=[];

		var rd=function(d){return Math.round(d*1000)/1000;};

		for(var i=1;i<data.length;i++){
			var d=data[i].y;
			var m1v1=ma1[i].y;
			var m1v0=ma1[i-1].y;
			var m2v1=ma2[i].y;
			var m2v0=ma2[i-1].y;

			var dma1=m1v1-m1v0;
			var dma2=m2v1-m2v0;
			var macd=m1v1-m2v1;

			console.log('162070 dma1:',dma1,' dam2:',dma2,'macd:',macd);

			if(dma1<dma2){
				/*
				if( Math.abs(dma1-dma1B)<offset &
					Math.abs(dma2-dma2B)<offset &
					Math.abs(macd-macdB)<offset 
				)
				*/
				if(macd<0 & 0-macd<0.0025) 
					buyData.push({x:i,y:data[i].y})

				
			}
			else if(dma1>dma2){
				/*
				if( Math.abs(dma1-dma1S)<offset &
					Math.abs(dma2-dma2S)<offset &
					Math.abs(macd-macdS)<offset 
				)*/
				if(macd>0 & macd<0.0025) 
					saleData.push({x:i,y:data[i].y})
			}

		}
		outData.push(buyData);
		outData.push(saleData);
		return outData;
	}

}