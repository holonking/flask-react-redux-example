import React, { Component } from 'react';
import ReactFauxDOM from 'react-faux-dom';
import ReactDom from 'react-dom';

//import d3 from 'd3';
//import SVGCanvas,{VScroller,VDisplay} from '../components/IDP_Charts';
import SVGCanvas, {VPoly,VPoints,VCandles,VLines} from '../components/ReactD3Tester';
import SecInterp from '../components/SecInterp';
import VLib from '../components/VLib.js';

//import styles from './D3.css';
import d3 from 'd3';




import classNames from 'classnames/bind';
//import { PageHeader } from 'react-bootstrap';
import styles from './D3.css';


import io from 'socket.io-client';



var c = classNames.bind(styles);
var log = logger('D3');





export default class JPlot extends Component {
  constructor(props) {
    super(props);
    log.info("from d3.constructor");
    this.gotDataHandlers=[];
    this.resizeHandlers=[];
    this.handleResize = this.handleResize.bind(this);
    this.state={selectorVis:'none'};
    this.graphList=[];
  }
  componentDidMount() {
    
 
    //assign event handlers
    window.addEventListener('resize', this.handleResize);
    this.appDisplay=document.getElementById('app message');
    this.serverDisplay=document.getElementById('server message');
    this.strategyDisplay=document.getElementById('strategy data');
    this.candleDisplay=document.getElementById('candle data');

    //setup drawing canvas
    var ele=document.getElementById('SVGContainer1');
    var mainCanvas=ReactDom.render(<SVGCanvas />,ele);
    this.resizeHandlers.push(function(){
      var w=this.refs.container.clientWidth;
      mainCanvas.setWidth(w);
    }.bind(this));
    mainCanvas.setHost(this);
    this.setSize();

    //connect socket.io
    console.log('prepare to connect to socket.io');
    var namespace='/api'
    var socket = io.connect('http://' + document.domain + ':' + 3001 + namespace );
    var self=this;

    socket.on('connect', function(){
      console.log('client side connected, socket=',socket);
      var serverMessage=document.getElementById('server message');
      this.graphList=[];
      

      socket.on('server response', function(msg){
        console.log('s->c:'+msg.data);
        serverMessage.innerHTML='s->c:'+msg.data;
      });

      socket.on('server set data', function(msg){
        console.log('s->c: got data=',msg.data);
        console.log('c:data[0]=',msg.data[0]);
        serverMessage.innerHTML='server setData';
        console.log('mainCanvas=',mainCanvas);
        //mainCanvas.clearGraphs();
        mainCanvas.setData(msg.data);
        this.graphList=[];

      });

      socket.on('server draw poly', function(msg){
        if(!msg.attr)msg.attr={};
        console.log('s->c: server draws a poly');
        serverMessage.innerHTML='server draws a polyline';
        var pma1=new VPoly(mainCanvas); 
        pma1.setData(msg.data).setAutoScale();
        if(msg.attr.color) pma1.setColor(msg.attr.color);
        mainCanvas.d3Update();
        self.addGraphList(pma1,msg.attr)
      });

      socket.on('server draw points', function(msg){
        if(!msg.attr)msg.attr={};
        console.log('s->c: server draws a set of points');
        serverMessage.innerHTML='server draws a set of points';
        var pts=new VPoints(mainCanvas); 
        pts.setData(msg.data).setAutoScale();
        if(msg.attr.color) pts.setColor(msg.attr.color);
        if(msg.attr.fill) pts.setFill(msg.attr.fill)
        mainCanvas.d3Update();
        self.addGraphList(pts,msg.attr)
      });

      socket.on('server draw candles', function(msg){
        if(!msg.attr)msg.attr={};
        console.log('s->c: server draws a candle graph');
        serverMessage.innerHTML='server draws a candle graph';
        var svgcomp=new VCandles(mainCanvas); 
        svgcomp.setData(msg.data)
        if(msg.attr.color) svgcomp.setColor(msg.attr.color);
        if(msg.attr.fill) svgcomp.setFill(msg.attr.fill)
        mainCanvas.d3Update();
        self.addGraphList(svgcomp,msg.attr)
      });

      socket.on('server draw lines', function(msg){
        if(!msg.attr)msg.attr={};
        console.log('s->c: server draws lines');
        serverMessage.innerHTML='server draws lines';
        var svgcomp=new VLines(mainCanvas); 
        svgcomp.setData(msg.data)
        if(msg.attr.color) svgcomp.setColor(msg.attr.color);
        if(msg.attr.fill) svgcomp.setFill(msg.attr.fill)
        mainCanvas.d3Update();
        self.addGraphList(svgcomp,msg.attr)
      });

      socket.emit('client startup', {data:'>>client startup'});
    });//socket.on
    

  }
  addGraphList(svgComp,attr){
    var name='unnamed';
    if(attr.name)name=attr.name;
    var count=this.graphList.length;
    var tagID='graphDisplay_'+count;
    var valID=tagID+'_val';
    var difID=tagID+'_dif';
    var xID=tagID+'_x';
    var pureClass='';
    if(count%2==0) pureClass='pure-table-odd';
    svgComp.displayTag={val:valID,dif:difID,x:xID};
    var handleCheck=function(){
      svgComp.isVisible=!svgComp.isVisible;
      svgComp.d3Update();
      this.setState({});
    }.bind(this);
    var cell= <tr className={pureClass}>
                <td>
                  <input type='checkBox' checked={svgComp.isVisible} onChange={handleCheck}>{count}</input>
                </td>
                <td>{name}&nbsp;</td>
                <td>&nbsp;<h id={valID}>-</h></td>
                <td>&nbsp;<h id={difID}>-</h></td>
                <td>&nbsp;<h id={xID}>-</h></td>
                <td>&nbsp;</td>
              </tr>;
    this.graphList.push(cell);
    this.setState({});
  }
  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize);
  }

  handleResize() {
    log.info('Window resize event.');
    this.setSize();
  }
  setSize() {
    var containerWidth = this.refs.container.clientWidth;
    if(this.resizeHandlers.length>0)
    {
      for (var i=0;i<this.resizeHandlers.length;i++)
      { 
        if(typeof(this.resizeHandlers[i])=='function')
          this.resizeHandlers[i](containerWidth);
        else log.info('from d3.handleResize, expected a function, got a ',typeof(this.resizeHandlers[i]));
      }//end for i
    }//end if

    //document.getElementById('button1').width=containerWidth;
    this.setState({
      width: containerWidth
    });
  }
  

  render() {
    return (
      <div ref="container">

        <div className={c('header')}>
          <h1>JPlot --socket.io</h1>
          <h2>single security viewer</h2>
        </div>

        <div className='pure-u-3-3' id='server message'>waiting dor server messages...</div>
        <div className='pure-u-3-3' id='app message'>waiting dor app messages...</div>
        <div className='pure-u-3-3' id='strategy data'>strategy data</div>

        <div className='pure-u-3-3'>
        <table>
          <tr>
            <td>
            <button className='pure-button' width='10px' onClick={function(){
                if(this.state.selectorVis=='')
                  this.setState({selectorVis:'none'});
                else this.setState({selectorVis:''});
            }.bind(this)}>+</button>
            </td>
          <td><h id='candle data'>waiting for candle data ...</h></td>
          </tr>
        </table>
        </div>

        <div id='selector' className='pure-u-3-3' style={{display:this.state.selectorVis}}> 
          <table className='pure-table' width='100%' style={{'font-size':'11px'}}>
          <thead>
            <tr>
              <th  width='10px'>VISIBILITY</th><th width='20px'>GRAPHS</th><th width='10px'>VALUE</th><th width='10px'>ROC</th><th width='10px'>X </th><th></th>
            </tr>
          </thead>
          <tbody>
            {this.graphList}
          </tbody>  
          </table>
        </div>
        <div id='SVGContainer1'></div>
        <div id='srcollerContainer'></div>
      </div>
    );
  }
}
