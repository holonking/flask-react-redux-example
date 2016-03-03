import React, { Component } from 'react';
import ReactDom from 'react-dom';
import d3 from 'd3';
import styles from './D3.css';
import VLib from './VLib.js';
import SVGComponent from'./SVGComponent.jsx'

var log = logger('D3');
export default class VPoly extends SVGComponent{
	constructor(canvas){
		super(canvas);
		log.debug('VPoly.constructor triggered, this.canvas.dq.length=',this.canvas.dq.length);
		this.rawData=[];
		this.showVertices=false;
		this.r=2;
		this.lineType='solid';
		this.showLines=true;
		this.color='steelblue';
	}
	d3Setup(){
		log.debug('VPoly.d3Setup() triggered ');
		super.d3Setup();
		
	
    	var path=this.g
    		.selectAll('path')
    		.data([this.data])
    		.enter()
    		.append('svg:path');

	}
	d3Update(){
		//if(this.data.length<1)return;
		//if(!this.g)return;
		if(!this.isVisible){
			this.g.selectAll('path').remove();
			this.g.selectAll('circle').remove();
			this.g.selectAll('line').remove();
			return;
		}
		super.d3Update();
		
    	log.debug('162090 VPoly.d3Update')
		if(!this.g)return;
		
        if(this.showLines){
        	//update the graph;
	        this.setLineScale();
	        this.g.selectAll('path').remove();
			var attr={'stroke':this.color,fill:'none'};
			this.g.selectAll('path')
				.data([this.data])
				.enter()
				.append('svg:path')
				.attr("d",this.lines)
				.attr(attr);

			//this.g.selectAll('path').exit().remove();
		}
		else{
			this.g.selectAll('path').remove();
		}
		//update circles
		if(this.showVertices)
		{

			var scaleX=this.canvas.scaleX;
			var scaleY=this.canvas.scaleY;
			var xoffset=this.canvas.dataL;
			

	
			console.log('d[0]=',this.data[0].x,',',this.data[0].y,'scaled to:',scaleX(0),',',scaleY(this.data[0].y));
		    //!! problem here, to be fixed
		    //should not require to remove all circle before enter data
		    this.g.selectAll('circle').remove();
			this.g
    		.selectAll('circle')
    		.data(this.data)
    		.enter()
    		.append('circle')
    		.attr('r',function(d,i){
    			if(i==this.selectedIndex)
    				return this.r*2;
    			return this.r;
    		}.bind(this))
    		.attr('cx',function(d,i){if(d.x) return scaleX(d.x); return scaleX(i)})
    		.attr('cy',function(d,i){if(typeof(d)=='number')return scaleY(d); return scaleY(d.y);})
    		.on('mouseover',function(d,i){
	            if(i!=this.selectedIndex){
	            //if(true){
	            	console.log('mouse over');
		            this.selectedIndex=i;
		            var val=Math.round(d.y*10000)/10000;
		            var message='item['+i+']:'+val;
		            document.getElementById('candle data').innerHTML=message;
		            this.d3Update();
	        	}
          	}.bind(this))
          	.on('mouseout',function(){
          		this.selectedIndex=-1;
          		this.d3Update();
          	}.bind(this))
    		.attr('stroke',this.color)
    		.attr('fill',function(){if(!this.fill)return this.color; else return this.fill}.bind(this));

		}
        
	}
	setLineScale(){

		var scaleX=this.canvas.scaleX;
		var scaleY=this.canvas.scaleY;
		var xoffset=this.canvas.dataL;
		

		this.lines=d3.svg.line()
                    .x(function(d,i){
                    	if(i==0)
                    		console.log('xoffset=',xoffset,' scaleX(i):',scaleX(i),'scaleX(i+xoffset):',scaleX(i+xoffset));
                      if(d.x) return scaleX(d.x+xoffset); return scaleX(i+xoffset);
                    })
                    .y(function(d,i){
                      var outVal=0
                      if(typeof(d)=='number') outVal=scaleY(d);
                      else outVal=scaleY(d.y);
                      return outVal;
                    });
	}
	setShowVertices(t){
		if(t==false){
			this.showVertices=false;
			this.g
    		.selectAll('circle')
    		.remove();
		}
		else 
		{
			this.showVertices=true;
		}
		return this;
	}
}
