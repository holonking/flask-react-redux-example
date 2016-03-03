import React, { Component } from 'react';
import ReactDom from 'react-dom';
import d3 from 'd3';
import styles from './D3.css';
import VLib from './VLib.js';
import SVGComponent from'./SVGComponent.jsx'


var log = logger('D3');
export default class VCandles extends SVGComponent{
	constructor(canvas){
		super(canvas);
		this.autoScale=true;
	}
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
		
		margin=this.getMargin();
		var barWidth=(this.canvas.getWidth()-margin.left-margin.right)/(this.canvas.dataR-this.canvas.dataL);
		barWidth-=1;
		var onMouseOver=function(d,i){this.selectedIndex=i};
		var onMouseOut=function(d){this.selectedIndex=-1};

		this.g.selectAll('line').remove()
		this.g.selectAll('rect').remove()


	    var lines=this.g.selectAll('line')
	      .data(this.data)
	      .enter()
	      .append('line')
	      .attr('x1',function(d,i){return scaleX(i);})
	      .attr('y1',function(d){return scaleY(d.h);})
	      .attr('x2',function(d,i){return scaleX(i);})
	      .attr('y2',function(d){return scaleY(d.l);})
	      .style('fill',function(d){if(d.o<d.c) return 'white'; else return 'steelblue';})
	      .style('stroke','steelblue')
	      .style('stroke-width',1)
	      .on('mouseover',onMouseOver)
	      .on('mouseout',onMouseOut);

	    var rects=this.g.selectAll('rect')
	      .data(this.data)
	      .enter()
	      .append('rect')
	      .attr('x',function(d,i){return scaleX(i)-(barWidth/2);})
	      .attr('y',function(d){ if(d.o>d.c) return scaleY(d.o); else return scaleY(d.c)})
	      .attr('width',barWidth)
	      .attr('height',function(d){return Math.max(1,Math.abs(scaleY(d.o)-scaleY(d.c)))})
	      .style('fill',function(d){if(d.o<d.c) return 'white'; else return 'steelblue';})
	      .style('stroke','steelblue')
	      .style('stroke-width',1)
	      .on('mouseover',onMouseOver)
	      .on('mouseout',onMouseOut);


	}

}
