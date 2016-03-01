import React, { Component } from 'react';
import ReactFauxDOM from 'react-faux-dom';
import ReactDom from 'react-dom';
//import d3 from 'd3';
//import SVGCanvas,{VScroller,VDisplay} from '../components/IDP_Charts';
import SVGCanvas, {VPoly} from '../components/ReactD3Tester';
import SecInterp from '../components/SecInterp';
import VLib from '../components/VLib.js';
//import styles from './D3.css';
import d3 from 'd3';
import classNames from 'classnames/bind';

//import { PageHeader } from 'react-bootstrap';
import styles from './D3.css';

var c = classNames.bind(styles);
var log = logger('D3');



export default class D3b extends Component {
  constructor(props) {
    super(props);
    log.info("from d3.constructor");
    this.gotDataHandlers=[];
    this.resizeHandlers=[];
    this.handleResize = this.handleResize.bind(this);
  }
  componentDidMount() {
    
    window.addEventListener('resize', this.handleResize);
  
    this.draw();
    this.setSize();

    //read file/////////////////////////////////////////
    var url = 'api/SSV/600000';
    this.readData(url);
  }

///////////////////////////////////////////////////////
///////////////////////////////////////////////////////
///////////////////////////////////////////////////////
///////////////////////////////////////////////////////

  //@d3.draw()
  //this is a one time initialization called by component did mount
  draw(){
    
    //add customized drawing objects
    var ele=document.getElementById('SVGContainer1');
    var thisCanvas1=ReactDom.render(<SVGCanvas />,ele);
    


    //handle recieved data
    this.gotDataHandlers.push(function(d){
      thisCanvas1.setData(d);
      
      //draw  polylines of moving averages
      var ma1=VLib.getMA(d,0);
      var ma5=VLib.getMA(d,5);
      var ma12=VLib.getMA(d,12);

      var pma1=new VPoly(thisCanvas1); pma1.setData(ma1).setAutoScale().setShowVertices().d3Update();
      var pma5=new VPoly(thisCanvas1); pma5.setData(ma5).setAutoScale().setColor('green').d3Update();
      var pma12=new VPoly(thisCanvas1); pma12.setData(ma12).setAutoScale().setColor('#aa8').d3Update();

      //draw point clouds
      var candleReverse=VLib.getCandleReverse(d);
      var cr1=new VPoly(thisCanvas1); 
      cr1.setData(candleReverse).setAutoScale().setShowVertices().setColor('black').d3Update();
      cr1.parallelData=false;
      cr1.showLines=false;
      cr1.r=3;
      cr1.d3Update();

      var strategy1=VLib.strategy1(ma1,ma5,ma12,
                                  -0.004,-0.002,0.002, 
                                  0.006,0.003,0.002,
                                  0.2
                                  );
      var buyDots=strategy1[0];
      var sellDots=strategy1[1];

      console.log('162070 buyDots.len=',buyDots.length);

      var pBuy=new VPoly(thisCanvas1);
      pBuy.setAutoScale().setData(buyDots).setShowVertices().setColor('blue');
      pBuy.r=5;
      pBuy.parallelData=false;
      pBuy.showLines=false;
      pBuy.d3Update();

      var pSell=new VPoly(thisCanvas1);
      pSell.setAutoScale().setData(sellDots).setShowVertices().setColor('red');
      pSell.r=5;
      pSell.parallelData=false;
      pSell.showLines=false;
      pSell.d3Update();


      var m1=VLib.getCandleReverseFeatures(d,ma5,ma12,5,'top')
      var m2=VLib.getCandleReverseFeatures(d,ma5,ma12,5,'bot')
      var display=document.getElementById('strategy data');
      display.innerHTML=m1+'<br><br>'+m2;

    });

    //handle resize
    this.resizeHandlers.push(function(){
      var w=this.refs.container.clientWidth;
      thisCanvas1.setWidth(w);
    }.bind(this));

  }
///////////////////////////////////////////////////////
///////////////////////////////////////////////////////
///////////////////////////////////////////////////////
///////////////////////////////////////////////////////

  handleGotData(data){
    if(this.gotDataHandlers.length>0)
    {
      for (var i=0;i<this.gotDataHandlers.length;i++)
      {
          if(typeof(this.gotDataHandlers[i])=='function')
            this.gotDataHandlers[i](data);
          else log.info('from d3.handleGotData, expected a function, got a ',typeof(this.gotDataHandlers[i]));
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
        else log.info('from d3.handleResize, expected a function, got a ',typeof(this.resizeHandlers[i]));
      }//end for i
    }//end if
    this.setState({
      width: containerWidth
    });
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
          <h1>D3 test Two</h1>
          <h2>single security viewer</h2>
        </div>
        <button>button1</button>
        <button>button2</button>
        <p id='message'>...</p>
        <p id='candle data'>open: close: high: low:</p>
        <p id='strategy data'>strategy data</p>
        <div id='SVGContainer1'></div>
        <div id='srcollerContainer'></div>
      </div>
    );
  }
}
