import React, { Component } from 'react';
import ReactDom from 'react-dom';
import d3 from 'd3';
import styles from './D3.css';
import VLib from './VLib.js';

var log = logger('D3');
export default class SVGComponent{
	//the constructor takes a canvas to which it's drawn on
	constructor(canvas){
		log.debug('SVGComponent.constructor triggered');
		this.canvas=canvas;
		this.autoScale=false;
		this.autoData=false;
		canvas.dq.push(this);
		this.rawData=[];
		this.data=[];
		this.vertices=[];
		this.d3Setup();
		this.isD3Setup=false;
		this.scaleX=function(d){return d;};
		this.scaleY=function(d){return d;};
		this.color='steelblue';
		this.selectedIndex=-1;
		this.parallelData=true;
		this.isVisible=true;
		

		//if(this.canvas.isReactComponentMounted)this.d3Setup();
	}
	d3Setup(){
		this.g=this.canvas.svg.append('g');
	}
	d3Update(){
		if(this.parallelData)
			this.data=this.canvas.getPartialData(this.rawData);
		else this.data=this.rawData;
	}
	setData(d){
		log.debug('SVGComponent.setData triggered');
		console.log('SVGComponent.setData');
		this.rawData=d; 
		this.canvas.setScale();
		this.d3Update();
		return this; 
	}
	setAutoScale(b){if(b)this.autoScale=b; else this.autoScale=true; return this;}
	setColor(c){this.color=c;return this;}
	setFill(c){this.fill=c;return this;}
	clearGraphics(){this.g.remove();}
}