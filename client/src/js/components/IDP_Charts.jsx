import React, { Component } from 'react';
import ReactFauxDOM from 'react-faux-dom';
import ReactDom from 'react-dom';
import d3 from 'd3';
import styles from './D3.css';
import VLib from './VLib.js';

var log = logger('D3');

export class HtmlBarChart extends Component {

  render() {
    var data = this.props.data;
    var width = this.props.width;
    //log.debug('data:', data, 'width:', width);

    if (!width) {
      // render nothing if the width of the containing div is unknown
      return (
        <div></div>
      );
    }
    width = Math.min(width, 420);

    var x = d3.scale.linear()
        .domain([0, d3.max(data)])
        .range([0, width]);

    var node = ReactFauxDOM.createElement('div');
    var chart = d3.select(node);
    chart.classed(styles.barChart, true);

    log.debug('node:', node);
    log.debug('chart:', chart);

    var bar = chart.selectAll('div');
    var barUpdate = bar.data(data);
    barUpdate.enter().append('div')
      .style('width', function(d) { return x(d) + "px"; })
      .text(function(d) { return d; });

    log.debug('bar:', bar);
    log.debug('barUpdate:', barUpdate);


    return node.toReact();
  }
}

class SVGComponents {
  constructor(host,props){
    //log.debug('/////////SVGComponents.construcor/////////');
    if(!props) props={};
    this.props=props;
    host.addComponent(this);

    //get data from host, and set the data if the data exists
    var data=host.getData();
    if(data) this.setData(data);
    this.partialData=false;
    this.host=host;
    this.mouseOver=false;
    this.mosueDown=false;
    this.autoScale=false;
    //if autoData=true, draw() method will autmatically fetch data from canvas
    //if autoData=false, you can customize your data by asigning data by SVGComponent.data=someData;
    this.autoData=true; 
    this.dataExtract=function(d){return d;};

    if(props.scaleX)this.scaleX=props.scaleX; else this.scaleX=function(d){return d;}
    if(props.scaleY)this.scaleY=props.scaleY; else this.scaleY=function(d){return d;}
  }
  update(){this.host.setState({});}
  draw(g){
    console.log("<<<<<<<<from super>>>>>>>>>")
    if(this.autoScale)
    {
      this.scaleX=this.host.getScaleX();
      this.scaleY=this.host.getScaleY();
      //log.debug('this.scaleX=',this.scaleX);
    }//end if

    if(this.autoData)
    {
      this.data=this.dataExtract(this.host.getData());
    }
    else if(this.rawData,this.autoScale,this.host.partialData){
        console.log('021950 cutting data.......')
        this.data=this.host.getPartialData(this.rawData);
      }
    else this.data=this.rawData;
    if(this.rawData)console.log('021950 SVGComponent.rawData[0]=',this.rawData[0]);
    console.log('021950 SVGComponent.draw data[0]=',this.data[0]);
    console.log('021950 SVGComponent.draw rawData[0]=',this.data[0]);

    var data=this.data;
    if(!data) return;
    if(!this.scaleX(1)) return;
    if(!this.scaleY(1)) return;
  }//end draw
  setAutoScale(t){this.autoScale=t;return this;}
  setData(d){
    console.log('021950 SVGComponent.setData(d) d[0]=',d[0]);
    this.rawData=d;
    this.autoData=false;
    this.update();
  }
  setPartialData(){this.partialData=true;}
  setDataExtract(f){
    this.dataExtract=f;
    return this;
  }
}
class VRect extends SVGComponents{
  constructor(host,props){
    super(host,props);
    //console.log('from VRect.constructor');
    this.x=0;
    this.y=0
    this.width=0;
    this.height=0;
    if(props)
        if(props.x)this.x=props.x;
        if(props.y)this.y=props.y;
        if(props.w)this.width=props.w;
        if(props.h)this.height=props.h;

  }
  draw(g){
    //console.log('from VRect.draw x=',this.x,' y=',this.y,' w=',this.width);
    var rect= g.append('rect')
                .attr('x',this.scaleX(this.x))
                .attr('y',this.scaleY(this.y))
                .attr('width',this.width)
                .attr('height',this.height)
                .style('fill','none')
                .style('stroke','steelblue');

  }
}
class VCandle extends SVGComponents{
  constructor(host,props){
    super(host,props);
    if(this.props.color)this.color=this.props.color; else this.color='steelblue';
    this.tag=new VTag(host);
    this.mIndex=-1;

    var thisCandle=this;
    this.onMouseOver=function(d,i){ 
            log.info('mouse over candle[',i,']');
            thisCandle.mIndex=i;
            /*
            thisCandle.tag
              .addLine('date :'+d.d)
              .addLine('open: '+d.o)
              .addLine('hight: '+d.h)
              .addLine('low: '+d.l)
              .addLine('close: '+d.c);

            var x=thisCandle.scaleX(i);
            var y=thisCandle.scaleY(Math.max(d.o,d.c))-10
            thisCandle.tag.setPos(x,y);
            */
            thisCandle.update();
        };
    this.onMouseOut=function(d){
            //thisTag.lines=[];
            thisCandle.mIndex=-1;
            thisCandle.update();};
    this.onMouseOverStyle=function(d,i){
            if(thisCandle.mIndex==i)
              return 2;
            else return 1;
        };

  }//end constructor

  //@VCandle.draw(g)
  draw(g)
  {
    super.draw(g);


    log.info('....................VCandle.draw..................');
    var data=this.data;
    var gap=1;
    var barWidth=Math.min(this.host.getWidth()/data.length-gap,30);


    var candleChart=g.append('g');
    
    var scaleX=this.scaleX;
    var scaleY=this.scaleY;
    
    console.log('@candle.draw  data[0]=',data[0]);
    console.log('scaleX=',scaleX);
    console.log('this.autoscale=',this.autoScale);
    console.log('x=',1,'scaleX(x)=',scaleX(1));

    var thisCandle=this;
    var thisTag=this.tag;
    

    
   

    var lines=candleChart.selectAll('line')
      .data(data)
      .enter()
      .append('line')
      .attr('x1',function(d,i){return scaleX(i);})
      .attr('y1',function(d){return scaleY(d.h);})
      .attr('x2',function(d,i){return scaleX(i);})
      .attr('y2',function(d){return scaleY(d.l);})
      .style('fill',function(d){if(d.o<d.c) return 'white'; else return 'steelblue';})
      .style('stroke','steelblue')
      .style('stroke-width',this.onMouseOverStyle)
      .on('mouseover',this.nMouseOver)
      .on('mouseout',this.onMouseOut);

    var rects=candleChart.selectAll('rect')
      .data(data)
      .enter()
      .append('rect')
      .attr('x',function(d,i){return scaleX(i)-(barWidth/2);})
      .attr('y',function(d){ if(d.o>d.c) return scaleY(d.o); else return scaleY(d.c)})
      .attr('width',barWidth)
      .attr('height',function(d){return Math.max(1,Math.abs(scaleY(d.o)-scaleY(d.c)))})
      .style('fill',function(d){if(d.o<d.c) return 'white'; else return 'steelblue';})
      .style('stroke','steelblue')
      .style('stroke-width',this.onMouseOverStyle)
      .on('mouseover',this.onMouseOver)
      .on('mouseout',this.onMouseOut);
      

  }
}

class VPoly extends SVGComponents{
  constructor(host,props)
  {
    log.info('/////////VPoly.construcor/////////');
    super(host,props);
    
    var color='steelblue';

    if(typeof(props)!='undefined')if(props.color) color=props.color;
    this.color=color;
    this.r=2;
    this.mIndex=-1;
    this.data=[{x:0,y:0},{x:10,y:40},{x:160,y:180},{x:460,y:0}];
    this.showData=false;
    this.tag=new VTag(host);

    if(typeof(props)!='undefined')
      if(props.data)this.data=props.data;
    if(typeof(props)!='undefined')
        if(props.scaleX)this.scaleX=props.scaleX; 
    if(typeof(props)!='undefined')
        if(props.scaleY)this.scaleY=props.scaleY; 
    if(typeof(props)!='undefined')
        if(props.showData)this.showData=true;
  }
  setScaleX(d){this.scaleX=d; return this;}
  setScaleY(d){this.scaleY=d; return this;}
  setShowData(b){
    this.showData=b;
    return this;
  }
  setColor(c){
    this.color=c;
    return this;
  }
  //@VPoly.draw
  draw(graphics)
  {
    super.draw(graphics);
    log.debug('....................VPoly.draw..................');
    console.log('021950 VPoly.draw data.length=',this.data.length,' data[0]=',this.data[0]);
    var g=graphics.append('g');
    var data=this.data;
    var scaleX=this.scaleX;
    var scaleY=this.scaleY;
    var attr={'stroke':this.color,fill:'none'};

    var lines=d3.svg.line()
                    .x(function(d,i){
                      if(d.x)return scaleX(d.x);
                      return scaleX(i);
                    })
                    .y(function(d){
                      var outVal=scaleY(d.y);
                      return outVal;
                    });
    var path=g.append('path').datum(data)
            .attr("d",lines)
            .attr(attr);

    var thisPoly=this;
    

    if(this.showData)
    {
      var thisTag=this.tag;
      var circles=g.selectAll('circle')
        .data(data)
        .enter()
        .append('circle')
        .attr('r',function(d,i){
          if(i==thisPoly.mIndex) return thisPoly.r+4; 
          return thisPoly.r;
        })
        .attr('cx',function(d){return scaleX(d.x);})
        .attr('cy',function(d){
            if(!d.y)return scaleY(0); 
            else return scaleY(d.y);
          })
        .on('mouseover',function(d,i){
            log.info('mouse over circle[',i,']');
            thisPoly.mIndex=i;
            thisTag.addLine('['+i+']='+d.y);
            var x=thisPoly.scaleX(d.x);
            var y=thisPoly.scaleY(d.y)-10
            thisTag.setPos(x,y);
            thisPoly.update();
          })
        .on('mouseout',function(d,i){
            thisPoly.mIndex=-1;
            g.select('#dataTag').remove();
            thisTag.lines=[];
            thisPoly.update();
          })
        .style({'stroke':this.color,'fill':this.color,'stroke-width':1});

      
    }//end if(thi.showData)


  }
}

class VTag extends SVGComponents{
  constructor(d,x,y){
    super(d);
    this.lines=[];
    //this.lines.push(d);
    if(!x)this.x=10; else this.x=x;
    if(!y)this.y=10; else this.y=y;
    this.fontSize=10;

  }
  addLine(d){
    log.debug('adding ',d,' to lines');
    this.lines.push(d);
    return this;
  }
  setPos(x,y){this.x=x;this.y=y;}
  getLongestestLine(){
    var count=0;
    for(var i=0;i<this.lines.length;i++)
    {
      var line=this.lines[i];
      if(line.length>count) count=line.length;
    }
    return count;
  }
  draw(g)
  {
    if(this.lines.length<=0) return 0;
    log.debug('............VTag.draw().................');
    var r=5;
    var h=this.fontSize*this.lines.length*1.2+(r*2);
    var w=this.getLongestestLine()*this.fontSize+r;

    //to do: draw the text and rectagle background
    var tag=g.append('g');


    tag.append('rect')
      .attr('x',this.x)
      .attr('y',this.y-h)
      .attr('width',w)
      .attr('height',h)
      .attr('rx',r)
      .attr('ry',r)
      .style('fill','#999');

    log.debug('this.lines.length=',this.lines.length);
    log.debug('this.lines[0]=',this.lines[0]);
    
    var thisTag=this;
    
    tag.selectAll('text')
      .data(this.lines)
      .enter()
      .append('text')
      .attr('x',thisTag.x+r)
      .attr('y',function(d,i){
          var posY=thisTag.y-h+r+((i+1)*thisTag.fontSize*1.2);
          log.debug('posY=',posY);
          return posY;
        })
      .text(function(d,i){return thisTag.lines[i];})
      .style('fill','white');
    
  }
}

//usage: 
//var props={x:10,y:10,text:'bala',onClick:functionCallBack};
//var buttonInstance=new VButton(graphics,props);
//var buttonInstance.draw();
class VButton extends SVGComponents{
  width(w){
    if(!w){
      if (this.width) return this.width;
    }//end if !w
    else{
      this.width=w;
    }//end else !w
  }
  draw(g){
    //buttons
    log.debug('....................VButton.draw..................');
    log.debug('this.fill=',this.fill);
    log.debug('this.mouseOver=',this.mouseOver);
    log.debug('this.host=',this.host);

    if(!this.props.x)this.props.x=30;
    if(!this.props.y)this.props.y=50;
    if(!this.props.text)this.props.text='T';
    if(!this.props.onClick)this.props.onClick=function(d){log.debug('button clicked');};
    if(!this.props.onMouseDown)this.props.onMouseDown=function(d){log.debug('button mosueDown');};
    if(!this.props.onMouseUp)this.props.onMouseUp=function(d){log.debug('button mosueUp');};

    var width;
    if(!this.width)
      width=this.props.text.length*10+10;
    else width=this.width;
    //var step=1;
    var host=this.host;
    var thisButton=this;
    var button=g.append('g');
    var rec=button.append('rect')
    .attr('x',this.props.x).attr('y',this.props.y).attr('rx',5).attr('ry',5).attr('width',width).attr('height',20)
    .style({'fill':'steelblue','stroke':'none','stroke-width':1,'font-size':10});

    if(!this.mouseOver)rec.style({'fill':'steelblue'});
    else rec.style({'fill':'lightblue'});

    button.append('text').attr('x',this.props.x+5).attr('y',this.props.y+15).text(this.props.text).style({'fill':'white'});
    button
    .on('click',this.props.onClick)
    .on('mouseover',function(d){
          thisButton.mouseOver=true;
          thisButton.update();
    })
    .on('mouseout',function(d){
          thisButton.mouseOver=false;
          thisButton.update();
        })
    .on('mousedown',this.props.onMouseDown);
  }
}



export default class SVGCanvas extends Component{
  //@SVGCanvas.componentDidMount
  constructor(props){
    super(props);
    log.info('SVGCanvas.constructor');
    this.partialData=false;
    this.showAxis=true;
    this.state={mx:-1,my:-1,dataL:0,dataR:20};
    this.isMouseDown=false;
    this.mouseDragOffset={x:0,y:0};
    this.isMouseOnCanvas=false;
  }
  setData(idata)
  {
    this.setState({data:idata});
  }
  setDataRange(l,r){
    console.log('setDataRange')
    this.setState({dataL:l,dataR,r}); 
  }
  onMouseDown(){
    console.log('SVGCanvas event mouse down');
    if(this.props.container){
      var loc=d3.mouse(document.getElementById(this.props.container));
      this.setState({mx:loc[0],my:loc[1]});
    }
    if(!this.isMouseDown){
        this.isMouseDown=true;
        this.posMouseDown={x:this.state.mx,y:this.state.my};
        this.mouseDragOffset={x:0,y:0};
      }
  }
  onMouseUp(){
    console.log('SVGCanvas event mouse up');
    if(this.props.container){
      var loc=d3.mouse(document.getElementById(this.props.container));
      this.posMouseUp={x:loc[0],y:loc[1]};
      this.setState({mx:loc[0],my:loc[1]});
    }
    this.isMouseDown=false;
    this.mouseDragOffset={x:0,y:0};
  }
  onMouseMove(){
    console.log('SVGCanvas event mouse move');
    if(this.props.container){
      var loc=d3.mouse(document.getElementById(this.props.container));
      this.setState({mx:loc[0],my:loc[1]});
    }
    if(this.isMouseDown){
      var offsetX=this.state.mx-this.posMouseDown.x;
      var offsetY=this.state.my-this.posMouseDown.y;
      this.mouseDragOffset={x:offsetX,y:offsetY};
    }
  }
  onMouseOver(){
  }
  onMouseOut(){
  }
  onMouseScroll(){
    var dy=d3.event.wheelDeltaY;
    this.scroll(dy);
  }
  scroll(num){}
  setMousePos(){
    this.setState({});
  }
  //@SVGCanvas.willComponentRecieveProps

  //@SVGCanvas.componentDidMount
  componentDidMount(){
    
    //log.info('SVGCanvas.componentDidMount container=',this.props.container);
    this.setState({dataL:100,dataR:150});
    
    var ele=document.getElementById(this.props.container);
    //ele.addEventListener('DOMMouseScroll',this.onMouseScroll);

    d3.select(ele)
      .on('mousemove',this.onMouseMove.bind(this))
      .on('mousedown',this.onMouseDown.bind(this))
      .on('mouseup',this.onMouseUp.bind(this))
      .on('mousewheel',this.onMouseScroll.bind(this))
      .on('mouseout',this.onMouseOut.bind(this))
      .on('mouseover',this.onMouseOver.bind(this));


    //the drawing list, will be added to automatically fro msvgComponents
    this.comps=[];
    this.dataComps=[];
    this.state={dl:0,dr:100};
    this.scaleYMax=function(d){return d.h};
    this.scaleYMin=function(d){return d.l};
    this.margin={left:20,right:20,top:20,bottom:20};
    log.info('SVGCanvas size=',this.width,",",this.height);

      
    
  }

  addCandle(){
    var c=new VCandle(this);
    c.setAutoScale(true);
    return c; }
  addPanel(){return new VPanel(this);}
  addPoly(){return new VPoly(this);}
  addTag(){return new VTag(this);}
  addMA(num){
    var thisCanvas=this;
    var extract=function(idata){
      var data=[];
      for (var i=0;i<idata.length;i++){
        var d=idata[i];
        data.push(d.o);
      }
      //console.log('data[0]=',data[0]);
      data=VLib.getMA(data,num);
      var jdata=VLib.convertLinearToJSON(data);
      log.info('MA5 3nd  postprocess extracted jdata[20]=',jdata[0]);
      return jdata;
    };
    return this.addPoly().setShowData(false).setAutoScale(true).setDataExtract(extract);
  }
  addComponent(c){this.comps.push(c);}
  //addDataComponent(c){this.DataComp.push(c);}
  setHost(h){this.host=h; return this;}
  //@SVGCanvas.getPartialData
  //get portion of çthe data
  //this is for pan and zoom, do not display all data at once
  getPartialData(data){
    if(!data) data=this.state.data;
    var partialData=data.slice(this.state.dataL,this.state.dataR);
    return partialData;
    //return data;
  }
  getWidth(){if(this.state.width) return this.state.width;}
  getHeight(){
    if(this.state.height) return this.state.height; 
    else return this.state.width*0.4;}
  getMargin(){return {top:5,right:5,left:5,bottom:5};}
  getScaleX(){
    console.log('from SVGCanvas.getScaleX()');
    var width=this.getWidth();
    var height=this.getHeight();
    var margin=this.getMargin();
    var xMin=0;
    var xMax=this.state.data.length;
    if(this.partialData){
      xMin=this.state.dataL;
      xMax=this.state.dataR;
    }
    console.log('dataL=',this.state.dataL,' dataR=',this.state.dataR,' data length=',this.state.data.length);
    var scaleX=d3.scale.linear().domain([0, xMax-xMin]).range([this.margin.left, width- this.margin.right ]);
    console.log('scaleX from SVGCanvas.getScaleX() =',scaleX);
    return scaleX;
  }
  getScaleY(){
    var idata=this.getData();
    var width=this.getWidth();
    var height=this.getHeight();
    var margin=this.getMargin();
    var fscaleYMax;
    var fscaleYMin;
    if(typeof(this.scaleYMax)=='function')fscaleYMax=this.scaleYMax; else fscaleYMax=function(d){return d;};
    if(typeof(this.scaleYMin)=='function')fscaleYMin=this.scaleYMin; else fscaleYMax=function(d){return d;};
    var yMax=d3.max(idata,fscaleYMax);
    var yMin=d3.min(idata,fscaleYMin);
    //log.debug("@ getScaleY ymax=",yMax," ymin=",yMin);
    var scaleY=d3.scale.linear().domain([yMin, yMax]).range([height-this.margin.bottom,this.margin.top]);
    return scaleY;
  }
  getData(){
    if(this.partialData)
      return this.getPartialData();
    return this.state.data;
  }
  ////////////////////////     !   ////////////////////////////
  //this is not done, it's not called by any, will fix later
  ////////////////////////     !   ////////////////////////////
  drawD3(){
    console.log('draw D3 data=',this.state.data,'width=',this.state.width,'thisDOMNode=',ReactDom.findDOMNode(this));
    if(!this.state.data) return;
    if(!this.state.width) return;
    var thisDOMNode=ReactDom.findDOMNode(this);
    

    var svg=d3.select(thisDOMNode).append('svg')
                      .attr('width',this.getWidth())
                      .attr('height',this.getHeight());

    console.log('svg=',svg);
    /*
    svg
      .on('mousemove',this.onMouseMove.bind(this))
      .on('mousedown',this.onMouseDown.bind(this))
      .on('mouseup',this.onMouseUp.bind(this))
      .on('mousewheel',this.onMouseScroll.bind(this))
      .on('mouseout',this.onMouseOut.bind(this))
      .on('mouseover',this.onMouseOver.bind(this));
      */
    console.log('drawD3 data=',this.state.data);
    //draw graphics on this canvas
    this.draw(svg);

    //draw each components
    if(this.comps) 
      if(this.comps.length>0){
        for(var i=0;i<this.comps.length;i++)
          this.comps[i].draw(svg);
      }
    //this.plotLinear(idata,graphics,width,height,scaleX,scaleY);


    //draw axies
    if(this.showAxis)
    {
      var xAxis=d3.svg.axis().scale(this.getScaleX()).orient('bottom');
      var yAxis=d3.svg.axis().scale(this.getScaleY()).orient('left');

      var gAxisX=svg.append('g')
        .attr('class','axis')
        .attr('transform','translate(0, '+(this.getHeight()-this.margin.bottom)+')')
        .call(xAxis);
      gAxisX.classed(styles.axis,true);
      var gAxisY=svg.append('g')
        .attr('class','axis')
        .attr('transform','translate('+this.margin.left+',0)')
        .call(yAxis);
      gAxisY.classed(styles.axis,true);
    } 
  }

  //@SVGCanvas.draw()
  draw(svg){
    console.log('isMouseOnCanvas=',this.isMouseOnCanvas);
    if(this.isMouseOnCanvas)
    {
      svg.append('line')
        .attr('x1',this.state.mx)
        .attr('y1',0)
        .attr('x2',this.state.mx)
        .attr('y2',this.getHeight())
        .attr('stroke','red')
        .attr('stroke-width',0.5);

      svg.append('line')
        .attr('x1',0)
        .attr('y1',this.state.my)
        .attr('x2',this.getWidth())
        .attr('y2',this.state.my)
        .attr('stroke','red')
        .attr('stroke-width',0.5);
    }
      
  }
  //@SVGCanvas.render()
  render(){
   
    
    log.info('-------from SVGCanvas.render()-------');
    //log.debug('this.comps=',this.comps);
    var width=this.getWidth();
    var data=this.state.data;

    // render nothing if the width of the containing div is unknown
    //or if the data is unknwon
    if (!width || !data) {
      if(!width) log.info("!!!!!!width is not ready!!!!!");
      if(!data) log.info("!!!!!data is not ready!!!!");
      return (<div>data not ready </div>);
    }

    var height=this.getHeight();
    var margin=this.getMargin();

    //add svg canvas
    this.element= ReactFauxDOM.createElement('div',{id:'CanvasContainer'});
    var container=d3.select(this.element).style('width',width).style('height',height);
    var svg=container.append('svg')
        .attr('width',width+margin.left+margin.right)
        .attr('height',height+margin.top+margin.bottom)
        .on('mousemove',function(){
              //console.log('mouse moving,this =',this);
        })
        .classed(styles.svg,true);

    
    //draw graphics on this canvas
    this.draw(svg);

    //draw each components
    if(this.comps) 
      if(this.comps.length>0){
        for(var i=0;i<this.comps.length;i++)
          this.comps[i].draw(svg);
      }
    //this.plotLinear(idata,graphics,width,height,scaleX,scaleY);


    //draw axies
    if(this.showAxis)
    {
      var xAxis=d3.svg.axis().scale(this.getScaleX()).orient('bottom');
      var yAxis=d3.svg.axis().scale(this.getScaleY()).orient('left');

      var gAxisX=svg.append('g')
        .attr('class','axis')
        .attr('transform','translate(0, '+(this.getHeight()-this.margin.bottom)+')')
        .call(xAxis);
      gAxisX.classed(styles.axis,true);
      var gAxisY=svg.append('g')
        .attr('class','axis')
        .attr('transform','translate('+this.margin.left+',0)')
        .call(yAxis);
      gAxisY.classed(styles.axis,true);
    }
    
    return this.element.toReact();
    
  }

}
export class VDisplay extends SVGCanvas{
  constructor(props){
    console.log('VDisplay constructor');
    super(props);
    if(props.scroller)this.scroller=props.scroller;
  }
  setScroller(scroller)
  {
    this.scroller=scroller;
    this.scroller.setState({dataL:this.state.dataL, dataR:this.state.dataR});

  }
  onMouseDown(){
    super.onMouseDown();
    if(this.mouseDragOffset.x==0 & this.mouseDragOffset.y==0){
      this.oDataL=this.state.dataL;
      this.oDataR=this.state.dataR;
    }
  }
  onMouseMove(){
    super.onMouseMove();
    //console.log('VDisplay event mouseDragOffset=',this.mouseDragOffset);
    if(this.mouseDragOffset.x!=0){
      var offsetX=this.mouseDragOffset.x;
      var unitWidth=this.state.width/(this.state.dataR-this.state.dataL);
      var unitOffset=Math.round(offsetX/unitWidth);
      console.log('unitWidth=',unitWidth,'VDisplay unioffset=',unitOffset,' dataL=',this.state.dataL,' data.length=',this.state.data.length);
      if(this.oDataL-unitOffset>=0 & this.oDataR-unitOffset<=this.state.data.length){
        this.setState({dataL:this.oDataL-unitOffset,dataR:this.oDataR-unitOffset});
        if(this.scroller)this.scroller.setState({dataL:this.oDataL-unitOffset,dataR:this.oDataR-unitOffset});
      }//end if this.dataL
    }//end if this.mouseDragOffset
  }
  scroll(num){
    //my mouse scrolls about 100 px minimum, this factor varies from mouse to mouse
    var factor=50;
    var step=Math.round(num/factor);
    var min=15;
    var ol=this.state.dataL;
    var or=this.state.dataR;
    var nl=ol;
    var nr=or;
    if(step>0)//scroll up
    {
      if(or-ol+step >=min) nl=ol+step;
      if(or-step-ol >=min) nr=or-step;
    }
    else if(step<0)//scroll down
    {
      if(ol+step >=0) nl=ol+step;
      if(or-step<this.state.data.length) nr=or-step;
    }
    this.setState({dataL:nl,dataR:nr});
    if(this.scroller)this.scroller.setState({dataL:nl,dataR:nr});
  }

}

export class VScroller extends SVGCanvas{
  constructor(props){
    super(props);
    this.showAxis=false;
    this.partialData=false;
    this.setRangeHandlers=[];
    this.dataL=100;
    if(props.display)this.display=props.display;
  }
    
  componentDidMount(){
    super.componentDidMount();
    var rec=new VRect(this,{x:100,y:100,w:100,h:100});
  }
  draw(svg)
  {
    
    console.log('VScroller.draw dataL,dataR',this.state.dataL,',',this.state.dataR);
    var scaleX=this.getScaleX();
    var barL=scaleX(this.state.dataL);
    var barR=scaleX(this.state.dataR);
    console.log('VScroller.draw barL,barR=',barL,',',barR);
    svg.append('rect')
        .attr('x',barL)
        .attr('y',0)
        .attr('width',barR-barL)
        .attr('height',this.getHeight())
        .attr('fill','lightblue');
    super.draw(svg);
  }
}