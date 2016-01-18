import React, { Component } from 'react';
import ReactFauxDOM from 'react-faux-dom';
import d3 from 'd3';
import styles from './D3.css';
import VLib from './VLib.js';

var log = logger('D3');

export class HtmlBarChart extends Component {

  render() {
    var data = this.props.data;
    var width = this.props.width;
    log.debug('data:', data, 'width:', width);

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

    log.info('Drew barchart with', data, ', width:', width);

    return node.toReact();
  }
}

class SVGComponents {
  constructor(host,props){
    if(!props) props={};
    host.addComponent(this);
    log.debug('/////////SVGComponents.construcor/////////');
    this.host=host;
    this.mouseOver=false;
    this.mosueDown=false;
    if(props)this.props=props;
    else this.props={}; 
    this.autoScale=false;

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
      console.log('this.scaleX=',this.scaleX);
    }//end if
  }//end draw
  setAutoScale(t){this.autoScale=t;return this;}
}

class VCandle extends SVGComponents{
  constructor(host,props){
    super(host,props);
    if(!props)props={};
    if(props.data) this.data=props.data; else this.data=[{o:17,h:20.5,l:10,c:18,v:100},{o:18,h:28.5,l:8,c:15,v:50}];
    if(props.color)this.color=props.color; else this.color='steelblue';
    this.tag=new VTag(host);
    this.mIndex=-1;
  }//end constructor
  setData(d){
    this.data=d;
  }
  //@VCandle.draw(g)
  draw(g)
  {
    var gap=2;
    var barWidth=Math.min(this.host.getWidth()/this.data.length-gap,30);


    var candleChart=g.append('g');
    if(this.autoScale)
    {
      this.scaleX=this.host.getScaleX();
      this.scaleY=this.host.getScaleY();
    }
    var scaleX=this.scaleX;
    var scaleY=this.scaleY;
    

    var thisCandle=this;

    console.log('@candle.draw data[0]=',this.data[0]);

    var thisTag=this.tag;
    var thisCandle=this;
    var onMouseOver=function(d,i){ 
            log.info('mouse over candle[',i,']');
            thisCandle.mIndex=i;
            thisTag
              .addLine('date :'+d.d)
              .addLine('open: '+d.o)
              .addLine('hight: '+d.h)
              .addLine('low: '+d.l)
              .addLine('close: '+d.c);
            var x=thisCandle.scaleX(i);
            var y=thisCandle.scaleY(Math.max(d.o,d.c))-10
            thisTag.setPos(x,y);
            thisCandle.update();
        };
    var onMouseOut=function(d){thisTag.lines=[];
            thisCandle.update();};

    var lines=candleChart.selectAll('line')
      .data(thisCandle.data)
      .enter()
      .append('line')
      .attr('x1',function(d,i){return scaleX(i);})
      .attr('y1',function(d){return scaleY(d.h);})
      .attr('x2',function(d,i){return scaleX(i);})
      .attr('y2',function(d){return scaleY(d.l);})
      .style('fill',function(d){if(d.o<d.c) return 'white'; else return 'steelblue';})
      .style('stroke','steelblue')
      .on('mouseover',function(d,i){onMouseOver(d,i);})
      .on('mouseout',function(d,i){onMouseOut(d,i);});

    var rects=candleChart.selectAll('rect')
      .data(thisCandle.data)
      .enter()
      .append('rect')
      .attr('x',function(d,i){return scaleX(i)-(barWidth/2);})
      .attr('y',function(d){ if(d.o>d.c) return scaleY(d.o); else return scaleY(d.c)})
      .attr('width',barWidth)
      .attr('height',function(d){return Math.abs(scaleY(d.o)-scaleY(d.c))})
      .style('fill',function(d){if(d.o<d.c) return 'white'; else return 'steelblue';})
      .style('stroke','steelblue')
      .on('mouseover',function(d,i){onMouseOver(d,i);})
      .on('mouseout',function(d,i){onMouseOut(d,i);});
      

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
  setData(data)
  {
    console.log('setData');
    this.data=data;
    return this;
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
  draw(graphics)
  {
    super.draw(graphics);
    console.log('....................VPoly.draw..................');
    console.log('this.data[0]=',this.data[0]);
    //console.log('this.scaleX=',this.scaleX);
    if(this.data==null) return 0;       
    var g=graphics.append('g');
    var data=this.data;
    var scaleX=this.scaleX;
    var scaleY=this.scaleY;
    var attr={'stroke':this.color,fill:'none'};

    var lines=d3.svg.line().x(function(d){return scaleX(d.x);}).y(function(d){return scaleY(d.y);});
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
    console.log('adding ',d,' to lines');
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
    console.log('............VTag.draw().................');
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

    console.log('this.lines.length=',this.lines.length);
    console.log('this.lines[0]=',this.lines[0]);
    
    var thisTag=this;
    
    tag.selectAll('text')
      .data(this.lines)
      .enter()
      .append('text')
      .attr('x',thisTag.x+r)
      .attr('y',function(d,i){
          var posY=thisTag.y-h+r+((i+1)*thisTag.fontSize*1.2);
          console.log('posY=',posY);
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
  draw(g){
    //buttons
    console.log('....................VButton.draw..................');
    console.log('this.fill=',this.fill);
    console.log('this.mouseOver=',this.mouseOver);
    console.log('this.host=',this.host);

    if(!this.props.x)this.props.x=30;
    if(!this.props.y)this.props.y=50;
    if(!this.props.text)this.props.text='T';
    if(!this.props.onClick)this.props.onClick=function(d){console.log('button clicked');};
    if(!this.props.onMouseDown)this.props.onMouseDown=function(d){console.log('button mosueDown');};
    if(!this.props.onMouseUp)this.props.onMouseUp=function(d){console.log('button mosueUp');};

    var width=this.props.text.length*10+10;
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
  componentDidMount(){
    //the drawing list, will be added to automatically fro msvgComponents
    this.comps=[];
    this.dataComps=[];
    this.state={dl:0,dr:100};
    if(this.props.width) this.width=this.props.width; else this.width=700;
    this.height=this.width*0.4;
    this.scaleYMax=function(d){return d.h};
    this.scaleYMin=function(d){return d.l};
    this.margin={left:20,right:20,top:20,bottom:20};

    
    //add things you want to draw
 



    this.gCandle=new VCandle(this);
    this.gCandle.setAutoScale(true);

    this.gMain=this.addPoly(this).setShowData(true).setAutoScale(true);
    this.gMA5=this.addPoly(this).setShowData(false).setAutoScale(true).setColor('green');
    this.gMA12=this.addPoly(this).setShowData(false).setAutoScale(true).setColor('purple');




    var tag=new VTag(this);
    tag.addLine("this is a demo");
    tag.addLine("of the multi-line");
    tag.addLine("text tag");
    tag.setPos(550,260);
   
    var thisCanvas=this;
    var callback1=function(){
        thisCanvs.moveStep(-1);
    };
    var callback2=function(){
        thisCanvas.moveStep(1);
    };
    this.b1=new VButton(this,{onMouseDown:callback1,x:5,y:30,text:'<'});
    this.b2=new VButton(this,{onMouseDown:callback2,x:30,y:30,text:'>'});

  }
  addPanel(h){if(h) return new VPanel(h); return new VPanel(this);}
  addPoly(h){ if(h) return new VPoly(h); return new VPoly(this);}
  addTag(h){if(h) return new VTag(h); return new VTag(this);}
  addComponent(c){this.comps.push(c);}
  addDataComponent(c){this.DataComp.push(c);}

  //@SVGCanvas.getPartialData
  //get portion of çthe data
  //this is for pan and zoom, do not display all data at once
  getPartialData(f){
    var data=this.props.rawData;
    //console.logy('this.props.rawData=',this.props.rawData);
    var idata=[];
    for( var i=this.state.dl;i<this.state.dr;i++)
    {
      //console.log('data[i].o=',data[i].o)
      //idata.push(parseFloat(data[i].o));
      if(!f) idata.push(data[i]);
      else if(typeof(f)=='function') idata.push(f(data[i]));

    }
    return idata;
  }
  getWidth(){return Math.max(this.props.width, 420);}
  getHeight(){return this.height;}
  getMargin(){return {top:5,right:5,left:5,bottom:5};}
  getScaleX(){
    var width=this.getWidth();
    var height=this.getHeight();
    var margin=this.getMargin();
    var xMin=this.state.dl;
    var xMax=this.state.dr;
    var scaleX=d3.scale.linear().domain([0, xMax-xMin]).range([this.margin.left, width- this.margin.right ]);
    return scaleX;
  }
  getScaleY(){
    var idata=this.getPartialData();
    var width=this.getWidth();
    var height=this.getHeight();
    var margin=this.getMargin();
    var fscaleYMax;
    var fscaleYMin;
    if(typeof(this.scaleYMax)=='function')fscaleYMax=this.scaleYMax; else fscaleYMax=function(d){return d;};
    if(typeof(this.scaleYMin)=='function')fscaleYMin=this.scaleYMin; else fscaleYMax=function(d){return d;};
    var yMax=d3.max(idata,fscaleYMax);
    var yMin=d3.min(idata,fscaleYMin);
    console.log("@ getScaleY ymax=",yMax," ymin=",yMin);
    var scaleY=d3.scale.linear().domain([yMin, yMax]).range([height-this.margin.bottom,this.margin.top]);
    return scaleY;
  }
  getData(){return this.props.rawData;}
  //@SVGCanvas.render()
  render(){

    log.debug('-------from SVGCanvas.render()-------');
    console.log('this.comps=',this.comps);
    var width=this.getWidth();
    var data=this.props.rawData;
    var height=this.getHeight();
    var margin=this.getMargin();

    // render nothing if the width of the containing div is unknown
    //or if the data is unknwon
    if (!width || !data) return (<div></div>);

    //add svg canvas
    var node = ReactFauxDOM.createElement('div')
    d3.select(node).style('width',width).style('height',height);
    var svg=d3.select(node).append('svg')
        .attr('width',width+margin.left+margin.right)
        .attr('height',height+margin.top+margin.bottom)
        .classed(styles.svg,true);

    /////////////////////
    //prepare data
    /////////////////////
    //console.log('partial data=',this.getPartialData());
    var pd=this.getPartialData(function(d){return parseFloat(d.o);});
    //console.log('@ canvas.draw pd=',pd);
    var jpd=VLib.convertLinearToJSON(pd);
    this.gMain.setData(jpd);
    var pdMA5=VLib.convertLinearToJSON(VLib.getMA(pd,5));
    var pdMA12=VLib.convertLinearToJSON(VLib.getMA(pd,12));
    console.log('jpd.length=',jpd.length);
    console.log('pdMA5.length=',pdMA5.length);
    console.log('jpd[0]=',jpd[0]);
    console.log('pdMA5[0]=',pdMA5[0]);
    this.gMA5.setData(pdMA5);
    this.gMA12.setData(pdMA12);
    this.gCandle.setData(this.getPartialData());



    //draw each components
    if(this.comps) 
      if(this.comps.length>0){
        for(var i=0;i<this.comps.length;i++)
          this.comps[i].draw(svg);
      }
    //this.plotLinear(idata,graphics,width,height,scaleX,scaleY);


    //draw axies
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

    return node.toReact();

  }
  //@SVGCanvas.moveStep
  moveStep(step){
    if(this.props.rawData)
    {
      var length=this.props.rawData.length;
      if(this.state.dl+step>0 & this.state.dr+step<length)
        this.setState({dl:this.state.dl+step,dr:this.state.dr+step});
      log.info('moved to the edge');
    }
  }//end moveStep

  


}