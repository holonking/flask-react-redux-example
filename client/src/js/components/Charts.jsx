import React, { Component } from 'react';
import ReactFauxDOM from 'react-faux-dom';
import d3 from 'd3';
import styles from './D3.css';

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


export default class SVGCanvas extends Component{
  componentDidMount(){
    this.state={dl:1000,dr:1550};
  }

  render(){
    console.log('from SVGCanvas.render()');
    var data=this.props.rawData;
    var width=this.props.width;
    width = Math.max(width, 420);
    var height=width*0.3;
    var margin={top:5,right:5,left:5,bottom:5};

    var node = ReactFauxDOM.createElement('div')
    d3.select(node).style('width',width).style('height',height);

    var graphics = d3.select(node).append('svg')
        .attr('width',width+margin.left+margin.right)
        .attr('height',height+margin.top+margin.bottom)
        .append('g')
        .attr('transform','translate('+margin.left+','+margin.top+')');
  
    if (!width || !data) {
      // render nothing if the width of the containing div is unknown
      //or if the data is unkwon
      return (
        <div></div>
      );
    }

    var yMax=d3.max(data,function(d){return d[1];})
    var yMin=d3.min(data,function(d){return d[1];})
    var xMin=this.state.dl;
    var xMax=this.state.dr;

    var idata=[]
    for( var i=this.state.dl;i<this.state.dr;i++)
    {
      idata.push(parseFloat(data[i][1]));
    }
    
    idata=[12,13,15,16,19.385,18.14,15,16,17,15.5,12.2,11.1,1.5,2,12,13,15,16,19.385,18.14,15,16,17,15.5,12.2,11.1,1.5,2,12,13,15,16,19.385,18.14,15,16,17,15.5,12.2,11.1,1.5,2];
    xMin=0;
    xMax=idata.length;
    yMin=0;
    yMax=20;




    var scaleX=d3.scale.linear().domain([xMin, xMax]).range([0, width]);
    var scaleY=d3.scale.linear().domain([yMin, yMax]).range([height,0]);

    console.log('idata.length=',idata.length);
    console.log('idata=',idata);
    console.log('idata[3]=',idata[3]);
    console.log('scaleY(idata[3])=',scaleY(idata[3]));




    console.log('yMin=',yMin);
    console.log('yMax=',yMax);

    

    
    
    

    this.plotLinear(idata,graphics,width,height,scaleX,scaleY);
    return node.toReact();

  }

  plotLinear(data,g,w,h,iscaleX,iscaleY,icolor,istrokeWidth,iradius){

    g.selectAll('path').remove();
    
    //set scale base on data
    if(!icolor)icolor='steelblue';
    if(!istrokeWidth)istrokeWidth=2; 
    if(!iradius)iradius=2;
    var padding=10;

    var attr={stroke:icolor,fill:"none",'stroke-width':istrokeWidth};
    var scaleX=iscaleX;
    var scaleY=iscaleY;
    /*
    console.log('data=',data);
    var min=d3.min(data);
    var max=d3.max(data);
    console.log('min=',min," max=",max);
    if(!iscaleY) var scaleY=d3.scale.linear().range([(h-padding),padding]).domain([min,max]);
    else scaleY=iscaleY;
    if(!iscaleX) var scaleX=d3.scale.linear().range([padding,(w-padding)]).domain([0,data.length-1]);
    else scaleX=iscaleX;
    */

    //plot line
    var lines=d3.svg.line().x(function(d,i){return scaleX(i);}).y(function(d){return scaleY(d)});
    //g.selectAll('path').remove();
    var path=g.append('path').datum(data)
            .attr("d",lines)
            .attr(attr);

      
    //interaction   
    path.on('mouseover',function(d){path.attr('stroke-width',4);})
      .on('mouseout',function(d){path.attr(attr);})
      .on('click',function(d){
        console.log('clicked');
      });

    //draw circles
    g.selectAll('circle').remove();

    var host=this;

    var circles=g.selectAll('circle')
      .data(data)
      .enter()
      .append('circle')
      .attr('r',host.state.radius||iradius)
      .attr('cx',function(d,i){return scaleX(i);})
      .attr('cy',function(d){
        if(!d)return scaleY(0); 
        else return scaleY(d);})
      .on('mouseover',function(d,i){
          //log.debug('this=',this);
          host.setState({radius:iradius+2});
          //d3.select(circles[0][i]).attr('r',5);
          //add text tag
          //console.log('g=',g);
          //console.log('mouse pos='+d3.mouse(g[0])[0]);
          //var pos=d3.mouse(this);
          //g.append('text').text('data='+d).attr({x:(pos[0]-10),y:(pos[1]-10),id:'textTag'});
        })
      .on('mouseout',function(d,i){
        host.setState({radius:iradius});
          //console.log('this=',this);
          //d3.select(this).attr('r',iradius);
          //g.select(circles[0][i]).attr('r',3);
          //g.select('#textTag').remove();
        })
      .style({stroke:icolor,fill:'white', 'stroke-width':2});


      

    //draw axies
    var xAxis=d3.svg.axis().scale(scaleX).orient('bottom');
    var yAxis=d3.svg.axis().scale(scaleY).orient('left');
    var axisStyle={'stroke':'#aaa','fill':'none','font-size': '6px'};

    g.append('g')
      .attr('class','axis')
      .attr('transform','translate(0, '+(h-padding)+')')
      .style(axisStyle)
      .call(xAxis);
    g.append('g')
      .attr('class','axis')
      .attr('transform','translate('+padding+',0)')
      .style(axisStyle)
      .call(yAxis);

  }

  plotCandle(data,g,w,h){

    //set scale base on data
    var padding=10;
    console.log('data.length=',data.length);
    console.log('data[0].o=',data[0].o);
    var min=d3.min(data,function(d){return d.l;});
    var max=d3.max(data,function(d){return d.h;});
    console.log('min=',min," max=",max);
    var scaleY=d3.scale.linear().range([(h-padding),padding]).domain([min,max]);
    var scaleX=d3.scale.linear().range([padding,(w-padding)]).domain([0,data.length-1]);



    //draw symbols
    //testSymbol(data,g,w,h)


    //draw circles
    g.selectAll('rect').remove();
    var gap=1;
    var barWidth=(w-(padding*2))/data.length-gap;
    //var barWidth=10; 
    console.log('barwidth=',barWidth);


    var mouseOverCandle=function(d,i){
          d3.select(rects[0][i]).attr('stroke-width',3);
          d3.select(lines[0][i]).attr('stroke-width',3);
          //add text tag
          //console.log('mouse pos='+d3.mouse(this)[0]);
          var pos=d3.mouse(this);
          g.append('text').text('Open:'+d.o).attr({x:(pos[0]-10),y:(pos[1]-50),id:'textTag','font-size':'8px'});
          g.append('text').text('High:'+d.h).attr({x:(pos[0]-10),y:(pos[1]-40),id:'textTag','font-size':'8px'});
          g.append('text').text('Low:'+d.l).attr({x:(pos[0]-10),y:(pos[1]-30),id:'textTag','font-size':'8px'});
          g.append('text').text('Close:'+d.c).attr({x:(pos[0]-10),y:(pos[1]-20),id:'textTag','font-size':'8px'});
          g.append('text').text('Volumn:'+d.v).attr({x:(pos[0]-10),y:(pos[1]-10),id:'textTag','font-size':'8px'});
    }
    var mouseOutCandle=function(d,i){
      d3.select(rects[0][i]).attr('stroke-width',1);
      d3.select(lines[0][i]).attr('stroke-width',1);
      g.selectAll('#textTag').remove();
    }

    lines=g.selectAll('line')
      .data(data)
      .enter()
      .append('line')
      .attr('x1',function(d,i){return scaleX(i);})
      .attr('y1',function(d){return scaleY(d.h);})
      .attr('x2',function(d,i){return scaleX(i);})
      .attr('y2',function(d){return scaleY(d.l);})
      .style('fill',function(d){if(d.o<d.c) return 'white'; else return 'steelblue';})
      .style('stroke','steelblue')
      .on('mouseover',mouseOverCandle)
      .on('mouseout',mouseOutCandle);

    rects=g.selectAll('rect')
      .data(data)
      .enter()
      .append('rect')
      .attr('x',function(d,i){return scaleX(i)-(barWidth/2);})
      .attr('y',function(d){ if(d.o>d.c) return scaleY(d.o); else return scaleY(d.c)})
      .attr('width',barWidth)
      .attr('height',function(d){return Math.abs(scaleY(d.o)-scaleY(d.c))})
      .style('fill',function(d){if(d.o<d.c) return 'white'; else return 'steelblue';})
      .style('stroke','steelblue')
      .on('mouseover',mouseOverCandle)
      .on('mouseout',mouseOutCandle);

    

    //draw axies
    var xAxis=d3.svg.axis().scale(scaleX).orient('bottom');
    var yAxis=d3.svg.axis().scale(scaleY).orient('left');

    g.append('g')
      .attr('class','axis')
      .attr('transform','translate(0, '+(h-padding)+')')
      .call(xAxis);
    g.append('g')
      .attr('class','axis')
      .attr('transform','translate('+padding+',0)')
      .call(yAxis);

  }



}