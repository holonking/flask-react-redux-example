import React, { Component } from 'react';
import ReactDom from 'react-dom';
import d3 from 'd3';
import styles from './D3.css';
import VLib from './VLib.js';
import SVGComponent from'./SVGComponent.jsx'
import SVGCanvas from'./SVGCanvas.lsx';

export default class SVGCanvasSelector extends SVGCanvas{
	constructor(props){
		super(props);
		this.showAxisY=false;
		this.height=50;
	}
	



}