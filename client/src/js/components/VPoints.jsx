import React, { Component } from 'react';
import ReactDom from 'react-dom';
import d3 from 'd3';
import styles from './D3.css';
import VLib from './VLib.js';
import SVGComponent from'./SVGComponent.jsx'
import VPoly from './VPoly.jsx'


var log = logger('D3');
export default class VPoints extends VPoly{
	constructor(canvas){
		super(canvas);
		this.showVertices=true;
		this.r=4;
		this.showLines=false;
		this.parallelData=false;
	}
	setR(r){
		this.r=r;
		this.d3Update();
	}
	setData(d){
		super.setData(d);
		if(!d[0].x) {
			this.parallelData=false;
			this.autoScale=true; 
		}
		console.log('VPoints.setData d=',d[0]);
		return this;
	}

}