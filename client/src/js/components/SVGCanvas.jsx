import React, { Component } from 'react';
import ReactDom from 'react-dom';
import d3 from 'd3';
import styles from './D3.css';
import VLib from './VLib.js';
import SVGComponent from'./SVGComponent.jsx'

var log = logger('D3');

export default class SVGCanvas extends Component
{
	///////////////////////////
	///////React methods///////
	///////////////////////////

	constructor(props){
		super(props);
		this.state={};

		//mouse positions
		this.mx=0;
		this.my=0;
		//last mouse positions
		this.mxl=0;
		this.myl=0;
		//mouse offset 
		this.mxd=0;
		this.myd=0;
		//mouse location when button down
		this.mxdown=-1;
		this.mydown=-1;
		//mouse condition
		this.isMouseDown=false;
		//UI variables
		this.panned=0;//paned distance since mouse down, unit in unit.
		this.dataLDown=0;
		this.dataRDown=0;

		//data related variable
		this.data=[];
		this.rawData=[];
		this.dataL=0;
		this.dataR=200;
		this.partialData=true;

		//display properties
		this.autoWidth=false;
		this.showAxisX=true;
		this.showAxisY=true;
		this.width=300;
		this.height=200;
		
		//drawing elements and scales
		this.dq=[];//the drawing que
		this.scaleX=function(d){return d;};
		this.scaleY=function(d){return d;};

		
		this.isReactComponentMounted=false;
		//to do: constructor
	}
	componentDidMount(){
		//to do: when component is first mounted
		log.debug('SVGCanvas.componentDidMount() triggered')
		this.isReactComponentMounted=true;
		this.d3Setup();
	}
	componentWillUpdate(){
		//determin if the react component should update
		//return true if decides to update
		log.debug('SVGCanvas.componentWillUpdate() triggered')
		//this.drawD3();
		this.d3Update();
		return false;
	}

	render(){
		//render the component
		//return an html element
		return <svg width={this.width} height={this.height} >SVG from SVGComponent</svg>
	}
	

	/////////////////////////////
	///////get set methods///////
	/////////////////////////////
	setHost(h){this.host=h;return this;}
	
	setData(d){
		this.rawData=d;
		log.debug('162050 setData 2');
		if(d.length>0 & d.length<this.dataR) this.dataR=d.length-1;
		this.d3Update()
		this.clearGraphics()
		return this;
	}
	showAxisX(t){this.showAxisX=t;return this;}
	showAxisY(t){this.showAxisY=t;return this;}
	setAutoWidth(b){if(b) this.autoWidth=b; else this.autoWidth=true;}
	setWidth(w){
		this.width=w;
		this.svg.attr('width',w);
		this.d3Update();
	}
	setScale(){
		log.debug('162050 setScale');
		var width=this.getWidth();
	    var height=this.getHeight();
	    var margin=this.getMargin();
	    var xMin=0;
	    var xMax=this.rawData.length;
	    
	    if(this.partialData){
	      xMin=this.dataL;
	      xMax=this.dataR;
	    }
	    //log.debug('dataL=',this.state.dataL,' dataR=',this.state.dataR,' data length=',this.state.data.length);
	    //var scaleX=d3.scale.linear().domain([0, xMax-xMin]).range([margin.left, width- margin.right ]);
	    var scaleX=d3.scale.linear().domain([xMin,xMax]).range([margin.left, width- margin.right ]);
	    this.scaleX=scaleX;
	   

	    var yMin=0;
	    var yMax=0;
	    var data=[];
	    if(this.partialData){
	    	data=this.getPartialData();
	    }
	    else data=this.rawData;

	    log.debug('162050 data.len=',data.length,' data[4]=',data[4]);
	    yMin=d3.min(data,function(d){if(d.l)return d.l; else if(d.y)return d.y});
	    yMax=d3.max(data,function(d){if(d.h)return d.h; else if(d.y)return d.y});

	    var scaleY=d3.scale.linear().domain([yMin, yMax]).range([height-margin.bottom,margin.top]);
	    this.scaleY=scaleY;

	    log.debug('162050 yMin=',yMin,' yMax=',yMax,' scaleY(17)=',scaleY(17));
	    return this;
	}
	getWidth(){
		return this.width;
	}
	getMargin(){return {top:20,right:20,left:50,bottom:40};}
	getHeight(){return this.height;}
	getPartialData(d){
		if(!d) return this.rawData.slice(this.dataL,this.dataR);
		return d.slice(this.dataL,this.dataR);
	}
	/////////////////////////////
	//////d3 SVG methods  ///////
	/////////////////////////////
	d3Setup(){
		var node=ReactDom.findDOMNode(this);
		log.debug('SVGCanvas.drawD3() node=',node);

		//setup mouse events
		this.svg=d3.select(node)
					.on('mousemove',this.onMouseMove.bind(this))
					.on('mousedown',this.onMouseDown.bind(this))
					.on('mouseup',this.onMouseUp.bind(this))
					.on('mousewheel',this.onMouseScroll.bind(this));
		this.svg.classed(styles.svg,true);

		//initialize drawing object for all components
		for(var i=0;i<this.dq.length;i++){
			if(!this.dq[i].isD3Setup)
				this.dq[i].d3Setup();
		}//end for i

		//draw axies
		this.AxisX=this.svg.append('g');
		this.AxisY=this.svg.append('g');
		this.Axis=this.svg.append('g');

		//draw mouse cursor data boxes
		this.mouseDataY=this.svg.append('g');
		this.mouseDataX=this.svg.append('g');
	}
	d3Update(){
		this.setScale();
		//draw axies
	    if(this.showAxis)
	    {
	      var xAxis=d3.svg.axis().scale(this.scaleX).orient('bottom');
	      var yAxis=d3.svg.axis().scale(this.scaleY).orient('left');

	      var margin=this.getMargin();
	      this.AxisX
	        .attr('class','axis')
	        .attr('transform','translate(0, '+(this.getHeight()-margin.bottom)+')')
	        .call(xAxis);
	      this.AxisX.classed(styles.axis,true);

	      this.AxisY
	        .attr('class','axis')
	        .attr('transform','translate('+margin.left+',0)')
	        .call(yAxis);
	      this.AxisY.classed(styles.axis,true);
	    } 

		
	    //update other omponents
		for(var i=0;i<this.dq.length;i++){
			this.dq[i].d3Update();
		}//end for i
	}
	clearGraphics(){
		for(var i=0;i<this.dq.length;i++){
			if(!this.dq[i])
				this.dq[i].clearGraphics();
		}//end for i
		this.dq=[];
	}

	/////////////////////////////
	////// UI Mechanics   ///////
	/////////////////////////////	
	zoomExtend()
	{
		this.dataL=0;
		this.dataR=this.rawData.length-1;
		return this;
	}
	zoom(step){
		step/=100;
		log.debug('zoom step=',step);

		if((this.dataR+step)-(this.dataL-step) <20)return;

		if(!step)return;
		if(this.dataL-step>=0)this.dataL-=step;
		if(this.dataR+step<this.rawData.length)this.dataR+=step;

		
		this.d3Update();
		this.drawMouseTracer();
	}
	pan(step){
		log.debug('162090 pan data')
		if(!step)return;

		log.debug('162010 step:',step,' dataL:',this.dataL,' dataLDown=',this.dataLDown);

		if(this.dataLDown-step>=0 & this.dataRDown-step<this.rawData.length){
			log.debug('162090 pan condition met')
			this.dataL=this.dataLDown-step;
			this.dataR=this.dataRDown-step;
		}
		else if(this.dataLDown-step<0)
		{
			step=this.dataLDown;
			this.dataL=0;
			this.dataR=this.dataRDown-step;
		}
		else if(this.dataRDown-step>=this.rawData.length)
		{
			step=this.rawData.length-this.dataR;
			this.dataL-=step;
			this.dataR=this.rawData.length-1;
		}

		this.d3Update();
		this.panned=step;
	}
	drawMouseTracer(){
		var margin=this.getMargin();
	    if(this.mx>margin.left & this.mx<this.getWidth()-margin.right & this.my<this.getHeight()-margin.bottom & this.my>margin.top){
		    
		    var dataDisplayCount=this.dataR-this.dataL;
		    var cursorX=this.mx-margin.left;
		    var pixelPerUnit=(this.getWidth()-margin.left-margin.right)/dataDisplayCount
		    var index=Math.round(cursorX/pixelPerUnit);
		    var adjMx=this.scaleX(index+this.dataL);
		    
		    //get adjusted Y value
		    var adjIndex=Math.round(this.dataL+index);
		    var selData=this.rawData[adjIndex];
		    //console.log('[',adjIndex,']',selData);

		    var adjMy=0;
		    if(selData.h) adjMy=this.scaleY((selData.h+selData.c+selData.h+selData.l)/4);
		    else if(selData.y) adjMy=this.scaleY(selData.y);

		   	//draw mouse lines
			this.Axis.selectAll('line').remove();
			var attr={stroke:'gray',strokewidth:0.5,'stroke-dasharray':(3,3),'stroke-opacity':0.9}
			//draw the cross hair
			this.Axis.append('line')
		        .attr('x1',adjMx)
		        .attr('y1',0)
		        .attr('x2',adjMx)
		        .attr('y2',this.getHeight()-margin.bottom)
		        .attr(attr);

	      	this.Axis.append('line')
		        .attr('x1',margin.left)
		        .attr('y1',adjMy)
		        .attr('x2',this.getWidth()-margin.right)
		        .attr('y2',adjMy)
		        .attr(attr);



			//draw the mouse data box
		    attr={stroke:'gray',fill:'white'}
		    var xBoxWidth=170;
		    var yBoxWidth=50;
		    var boxHeight=20

		    this.mouseDataX.selectAll('rect').remove();
		    this.mouseDataX.append('rect')
		    	.attr('x',this.mx-(xBoxWidth/2))
		    	.attr('y',this.getHeight()-this.getMargin().bottom+3)
		    	.attr('rx',5)
		    	.attr('ry',5)
		    	.attr('width',xBoxWidth)
		    	.attr('height',boxHeight)
		    	.attr(attr);

		    this.mouseDataY.selectAll('rect').remove();
		    this.mouseDataY.append('rect')
		    	.attr('x',0)
		    	.attr('y',adjMy-(boxHeight/2))
		    	.attr('rx',5)
		    	.attr('ry',5)
		    	.attr('width',yBoxWidth)
		    	.attr('height',boxHeight)
		    	.attr(attr);

		    this.mouseDataX.selectAll('text').remove();
		    this.mouseDataX.append('text')
		    	.attr('x',this.mx-(xBoxWidth/2)+5)
		    	.attr('y',this.getHeight()-this.getMargin().bottom+15)
		    	.text(function(){
		    		if(selData.time) return selData.time;
		    		return 'time unkown';
		    	})
		    	.attr('font-size','11px')
		    	.attr('fill','steelblue');
		    this.host.appDisplay.innerHTML=adjIndex;
		    this.host.candleDisplay.innerHTML='<'+selData.secNum+'> O:'+selData.o+' C:'+selData.c+' H:'+selData.h+' L:'+selData.l+' v:',selData.v;
		
		    //update graph display tag for each graph
		    for(var i=0;i<this.dq.length;i++){
		    	//console.log('tagVal search i=',i);
				if(this.dq[i].displayTag){
					var graph=this.dq[i];
					//console.log('graph is parallel=',graph.parallelData);
					if(graph.parallelData){
						var selNode=graph.rawData[adjIndex];
						var yVal=this.getY(selNode);
						var xVal=this.getX(selNode,adjIndex);
						document.getElementById(graph.displayTag.val).innerHTML=yVal;
						document.getElementById(graph.displayTag.x).innerHTML=xVal;
					}//if(this.parallelData)
				}//end if
			}//end for i


		}//end if

	}
	getY(node){
		var yVal=0;
		if(node.y)yVal=node.y;
		else if(typeof(node)=='number') yVal=node;
		else yVal='-';
		return yVal
	}
	getX(node,i){
		if(node.x)return node.x;
		else return i
	}

	///////////////////////////
	///////mouse methods///////
	///////////////////////////
	onMouseMove(){
		var node=ReactDom.findDOMNode(this);
		var mouseLoc=d3.mouse(node);
		this.mx=mouseLoc[0];
		this.my=mouseLoc[1];
		this.mxd=this.mx-this.mxl;
		this.myd=this.my-this.myl;

		//todo
		//this.d3Update();
		//get equivalent pan steps

		var numOfData=this.getPartialData().length;
		log.debug('162090 numOfData=',numOfData);
		if(this.isMouseDown & numOfData>0){
			var dx=this.mx-this.mxdown;
			var pixelPerUnit=this.getWidth()/numOfData;
			var panStep=Math.round(dx/pixelPerUnit);
			//var actualStep=panStep-this.panned;
			this.pan(panStep);
			log.debug('162090 dragging canvas')
			
		}

		//keep these two lines at the bottom
		this.mxl=mouseLoc[0];
		this.myl=mouseLoc[1];

		this.drawMouseTracer();
	}
	onMouseDown(){
		log.debug('mouseevent mousedown');
		d3.event.preventDefault();
		d3.event.stopPropagation();
		if(!this.isMouseDown){
			this.isMouseDown=true;
			var node=ReactDom.findDOMNode(this);
			var mouseLoc=d3.mouse(node);
			this.mxdown=mouseLoc[0];
			this.mydown=mouseLoc[1];
			this.panned=0;
			this.dataLDown=this.dataL;
			this.dataRDown=this.dataR;
		}
	}
	onMouseUp(){
		log.debug('mouseevent mouseUp');
		this.mxdown=-1;
		this.mydown=-1;
		this.isMouseDown=false;
		this.panned=0;
	}
	onMouseOut(){
		log.debug('mouseevent mouseOut');
	}
	onMouseOver(){
		log.debug('mouseevent mouseOver');
	}
	onMouseScroll(){
		log.debug('mouseevent mouseScroll');
		d3.event.preventDefault();
		d3.event.stopPropagation();
		var dy=d3.event.wheelDeltaY;
		this.zoom(dy);
	}

	/////////////////////////////////////
	///////public drawing methpds ///////
	/////////////////////////////////////

}
