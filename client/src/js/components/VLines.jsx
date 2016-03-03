import React, { Component } from 'react';
import ReactDom from 'react-dom';
import d3 from 'd3';
import styles from './D3.css';
import VLib from './VLib.js';
import SVGComponent from'./SVGComponent.jsx'


var log = logger('D3');
//each line can be {x1:0,y1:0,x2:1,y2:2,profit:100} or [x1,y1,x2,y2,profit]
export default class VLines extends SVGComponent{
	constructor(canvas){
		super(canvas);
		this.autoScale=true;
		this.showVertices=true;
		this.color='purple';
		this.r=4;
	}
	showEndPoints(b){
		if(b)this.showVertices=b;
		else this.showVertices=true;
		return this;
	}
	setColor(c){this.color=c; return this;}
	d3Update(){
		if(!this.isVisible){
			this.g.selectAll('path').remove();
			this.g.selectAll('circle').remove();
			this.g.selectAll('line').remove();
			return;
		}
		super.d3Update();
		var scaleX=this.canvas.scaleX;
		var scaleY=this.canvas.scaleY;
		var xoffset=this.canvas.dataL;

		var getNodeX1=function(d,i){if(d.x1) return scaleX(d.x1); if(typeof(d[0])=='number')return scaleX(d[0]); return 0;};
		var getNodeY1=function(d,i){if(d.y1) return scaleY(d.y1); if(typeof(d[1])=='number')return scaleY(d[1]); return 0;};
		var getNodeX2=function(d,i){if(d.x2) return scaleX(d.x2); if(typeof(d[2])=='number')return scaleX(d[2]); return 0;};
		var getNodeY2=function(d,i){if(d.y2) return scaleY(d.y2); if(typeof(d[3])=='number')return scaleY(d[3]); return 0;};
		var onMouseOVer=function(){
			this.g.selectAll('text').remove;
			this.g.append('text')
		    	.attr('x',this.mx)
		    	.attr('y',function(){
		    		var offset=5;
		    		if(this.my>this.getHeight()/2) offset=-5;
		    		return this.my+offset;
		    	})
		    	.text(function(d){
		    		var str=0;
		    		var end=0;
		    		var profit='unknown';
		    		if(typeof(d[4])=='number') profit=d[4];
		    		else if(typeof(d[0])=='number') profit=d[3]-d[1];
		    		else if(d.profit) profit=d.profit;

		    		if(typeof(d[0])=='number') {str=d[1];end=d[3];}
		    		else if(d.y1) {str=d.y1;end=d.y2;}

		    		return 'str:'+str+' end:'+end+' prof:'+profit;
		    	})
		    	.attr('font-size','11px')
		    	.attr('fill','steelblue');
		}

		var node=this.data[0]
		console.log('VLINE.d3Update d[1]=',node[1],' scaled=',scaleY(node[1]));
		var attr={stroke:this.color,strokewidth:1}
		
		this.g.selectAll('line').remove();
		this.g.selectAll('circle').remove();

		this.g.selectAll('line')
			.data(this.data)
			.enter()
			.append('line')
			.attr('x1',getNodeX1)
			.attr('y1',getNodeY1)
			.attr('x2',getNodeX2)
			.attr('y2',getNodeY2)
			.attr(attr);
		if(this.showVertices){
			this.g.selectAll('circle')
				.data(this.data)
				.enter()
				.append('circle')
				.attr('x',getNodeX1)
				.attr('y',getNodeY1)
				.attr('r',this.r)
				.attr(attr);
			this.g.selectAll('circle')
				.data(this.data)
				.enter()
				.append('circle')
				.attr('x',getNodeX2)
				.attr('y',getNodeY2)
				.attr('r',this.r)
				.attr(attr);
		}//if show vertices
	}//d3Update
}