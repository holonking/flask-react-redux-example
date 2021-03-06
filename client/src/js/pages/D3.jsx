import React, { Component } from 'react';
import ReactFauxDOM from 'react-faux-dom';
import ReactDom from 'react-dom';
//import d3 from 'd3';
import SVGCanvas,{VScroller,VDisplay} from '../components/IDP_Charts';
import SecInterp from '../components/SecInterp';
import VLib from '../components/VLib.js';
//import styles from './D3.css';
import d3 from 'd3';
import classNames from 'classnames/bind';

//import { PageHeader } from 'react-bootstrap';
import styles from './D3.css';

var c = classNames.bind(styles);
var log = logger('D3');



export default class D3 extends Component {
  constructor(props) {
    super(props);
    log.info("from d3.constructor");
    this.gotDataHandlers=[];
    this.resizeHandlers=[];
    this.handleResize = this.handleResize.bind(this);
    this.dataL=100;
    this.dataR=200;
  }
  componentDidMount() {
    // Tell the D3 bar chart the size of the containing element, thus making 
    // the chart "responsive". This has to be done in componentDidMount() 
    // because the size of the div is unknown before mounting.
    
    log.info("from d3.componentDidMount");
    // do the same on window resize
    window.addEventListener('resize', this.handleResize);
    this.domHolders=[<div></div>];
    
    this.draw();
    this.setSize();

    //read file/////////////////////////////////////////
    var url = 'api/SSV/600000';
    this.readData(url);
  }

  //@d3.draw()
  //this is a one time initialization called by component did mount
  draw(){
    
    //add customized drawing objects
    var ele=document.getElementById('SVGContainer1');
    var thisCanvas1=ReactDom.render(<VDisplay container='SVGContainer1'/>,ele);

    //create a data diaply which shows partial data
    thisCanvas1.addCandle();
    //thisCanvas1.addMA(5).setColor('green');
    //thisCanvas1.addMA(12);
    var ma5=thisCanvas1.addPoly();
    ma5.setAutoScale(true);
    //ma5.setData([{x:0,y:0},{x:100,y:100}]);
    
    thisCanvas1.partialData=true;
    this.resizeHandlers.push(function(w){thisCanvas1.setState({width:w});});
    this.gotDataHandlers.push(function(d){
        //handle got data, asign data to required individuals
        thisCanvas1.setData(d);
        ma5.setData(VLib.getMA(d,5));
      });

    
    //create scroller which shows complete data
    var thisScroller=ReactDom.render(<VScroller container='srcollerContainer'/>,document.getElementById('srcollerContainer'));
    thisScroller.setState({height:50});
    //thisScroller.addMA(0);
    thisScroller.margin.bottom=5;
    this.resizeHandlers.push(function(w){thisScroller.setState({width:w});});
    this.gotDataHandlers.push(function(d){thisScroller.setData(d);});

    //link up the display and the scroller
    thisCanvas1.setScroller(thisScroller);

  }

  handleGotData(data)
  {
    if(this.gotDataHandlers.length>0)
    {
      for (var i=0;i<this.gotDataHandlers.length;i++)
      {
          if(typeof(this.gotDataHandlers[i])=='function')
            this.gotDataHandlers[i](data);
          else log.info('from d3.hadleGotData, expected a function, got a ',typeof(this.gotDataHandlers[i]));
      }//end for i
    }//end if
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
        else log.info('from d3.hadleResize, expected a function, got a ',typeof(this.gotDataHandlers[i]));
      }//end for i
    }//end if
    this.setState({
      width: containerWidth
    });
    if(this.canvas1) this.canvas1.setState({width:containerWidth});
    else log.info('canvas1 not found @d3.setSize()');
  }
  readData(url){
    fetch(url)
      .then(function(res) {
        if (__DEV__) {
          console.log('res:', res);
        }
        //return res.arrayBuffer();
        return res.json();
      })
      .then(function(data) {
        if (__DEV__) {
          //data = JSON.stringify(data);
          //console.log('data:', data);
          console.log('got data, data.length:', data.length);
          //console.log('data[0]:', data[0]);
        }
        console.log('got data, send to secInterp');
        data=SecInterp.ticksOfSecToCandleOfMin(data);
        console.log('after candlize data[0]:', data[0]);
        //this.setState({data:data});
        this.handleGotData(data);
      }.bind(this));
  }

  render() {
    return (
      <div ref="container">

        <div className={c('header')}>
          <h1>D3 test</h1>
          <h2>single security viewer</h2>
        </div>
        <button>button1</button>
        <button>button2</button>
        <p id='candle data'>open: close: high: low:</p>
        <p id='strategy data'>strategy data</p>
        <div id='SVGContainer1'></div>
        <div id='srcollerContainer'></div>
      </div>
    );
  }
}
