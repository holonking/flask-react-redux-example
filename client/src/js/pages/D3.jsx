import React, { Component } from 'react';
import { PageHeader } from 'react-bootstrap';
import ReactFauxDOM from 'react-faux-dom';
import ReactDom from 'react-dom';
//import d3 from 'd3';
import SVGCanvas from '../components/IDP_Charts';
import SecInterp from '../components/SecInterp';
//import styles from './D3.css';

var log = logger('D3');
SecInterp.test();



export default class D3 extends Component {
  constructor(props) {
    super(props);
    //this.state = {data: [4, 8, 15, 16, 23, 42]};
    this.handleResize = this.handleResize.bind(this);
  }
  componentDidMount() {
    // Tell the D3 bar chart the size of the containing element, thus making 
    // the chart "responsive". This has to be done in componentDidMount() 
    // because the size of the div is unknown before mounting.
    this.setSize();
    // do the same on window resize
    window.addEventListener('resize', this.handleResize);


    //read file/////////////////////////////////////////
    var url = 'api/SSV/600000';
    this.readData(url);

    //draw all you want to draw
    //this.svgPanelMain=<SVGCanvas {...this.state} />;
   // ReactDom.render(svgPanelMain,document.getElementById('SVGContainer'));

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
          console.log('data:', data);
          console.log('data.length:', data.length);
          console.log('data[0]:', data[0]);
        }
        console.log('got data, send to secInterp');
        data=SecInterp.ticksOfSecToCandleOfMin(data);
        console.log('after candlize data[0]:', data[0]);
        //console.log('data:', data);
        //console.log('data.length:', data.length);
        //console.log('data[0]:', data[0]);
        this.setState({rawData:data});

      }.bind(this));
 }

  render() {
    //ReactDom.render(this.svgPanelMain,document.getElementById('SVGContainer'));
    return (
      <div ref="container">
        <PageHeader>D3.js test page <small>Single Security Viewer</small></PageHeader>
        <div id='SVGContainer'>will add svg here</div>
        <SVGCanvas {...this.state} />
      </div>
    );
  }
}
