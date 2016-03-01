import React, { Component } from 'react';
import ReactDom from 'react-dom';
import d3 from 'd3';
import styles from './D3.css';
import VLib from './VLib.js';

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
		this.showAxis=false;
		this.width=300;
		this.height=300;
		
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
		return <svg width={400} height={300} >SVG from SVGComponent</svg>
	}
	

	/////////////////////////////
	///////get set methods///////
	/////////////////////////////
	setHost(h){this.host=h;return this;}
	
	setData(d){
		this.rawData=d;
		log.debug('162050 setData 2');
		this.showAxis=true;
		if(d.length>0 & d.length<this.dataR) this.dataR=d.length-1;
		this.d3Update()
		this.clearGraphics()
		return this;
	}
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
		    	console.log('tagVal search i=',i);
				if(this.dq[i].displayTag){
					var graph=this.dq[i];
					console.log('graph is parallel=',graph.parallelData);
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


//------------------------------------------------------------


export class SVGComponent{
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
//------------------------------------------------------------



export class VPoly extends SVGComponent{
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

//------------------------------------------------------------
export class VPoints extends VPoly{
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
//------------------------------------------------------------
//each line can be {x1:0,y1:0,x2:1,y2:2,profit:100} or [x1,y1,x2,y2,profit]
export class VLines extends SVGComponent{
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


//------------------------------------------------------------
export class VCandles extends SVGComponent{
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


