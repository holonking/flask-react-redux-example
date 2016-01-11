export default class SecInterp{
		static test(){console.log('print from SecInterp static function')}
		
		//input daya:[[hhmmss,price,s,v],[...],... ]
		static ticksOfSecToCandleOfMin(data)
		{
			var outData=[];

			var lTime=[-1,-1,-1];
			var lPrice=data[0][1];
			var lBuyOrSale=-1;
			var lVolume=-1;

			var high=lPrice;
			var low=lPrice;
			var open=lPrice;
			var close=lPrice;
			var totalVol=0;

			for(var i=0;i<data.length;i++)
			{
				var row=data[i];
				var rTime=Utilities.getTime(row[0]);
				var rPrice=row[1];
				var rBuyOrSale=row[2];
				var rVolume=row[3];

				if(rTime [1]!=lTime[1] && i!=0)
				{
					//mins are different
					close=rPrice;
					outData.push({o:open,h:high,l:low,c:close,v:totalVol,t:rTime[0]+":"+rTime[1]});
					totalVol=0;
					if(i+1<data.length){
						high=low=open=data[i+1][1];
					}
					else break;
				}
				totalVol+=rVolume;
				if(rPrice>high) high=rPrice;
				else if (rPrice<low)low=rPrice;

				lTime=rTime;
				lPrice=rPrice;
				lBuyOrSale=rBuyOrSale;
				lVolume=rVolume;
			}
			console.log('outData=',outData);
			console.log('outData.length=',outData.length)
			return outData;

		}

}


class Utilities{
	static getTime(time)
	{
		var h,m,s;
		if(time.length<6)
		{
			h=time[0];
			m=time[1]+time[2];
			s=time[3]+time[4];
		}
		else
		{
			h=time[0]+time[1];
			m=time[2]+time[3];
			s=time[4]+time[5];
		}
		return [h,m,s];
	}
}