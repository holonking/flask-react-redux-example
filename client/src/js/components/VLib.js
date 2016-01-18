var log=logger('VLib');

export default class VLib{
	static convertLinearToJSON(data){
		console.log("converLinearToJSON()");
	    var outdata=[]
	    for(var i=0;i<data.length;i++)
	    {
	      var d={'x':i,'y':data[i]};
	      outdata.push(d);
	    }
	    console.log("dataConvertedTo");
	    return outdata;
	}

	//@static getMA
	//parms:data=The linear data to get the MA
	//parms:num=the number of time units to calculate MA
	//get the moving average of num of time units
	static getMA(data,num){
		if(!data)log.debug('!data @VLib.getMA(data,num');
		if(!num)log.debug('!data @VLib.getMA(data,num');
		var outData=[];
		for(var i=0;i<data.length;i++)
		{
			var total=data[i];
			var counter=1;
			for(var j=1;j<=num;j++)
			{
				var index=i-j;
				if(index>0 & index<data.length)
				{
					total+=data[index];
					counter++;
				}//end if

			}//end for j
			outData.push(total/counter);
		}//end for i
		return outData;
	}//end getMA()

}