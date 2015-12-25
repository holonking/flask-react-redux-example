import React, { Component } from 'react';
import { PageHeader } from 'react-bootstrap';
import ReactFauxDOM from 'react-faux-dom';
import d3 from 'd3';

var log = logger('D3');


class HtmlBarChart extends Component {
  render() {
    var data = this.props.data;
    var width = this.props.width;
    log.debug('data:', data);
    log.debug('width:', width);

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
    chart.classed('D3--chart', true);

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


export default class Docs extends Component {
  constructor(props) {
    super(props);
    this.state = {data: [4, 8, 15, 16, 23, 42]};
  }
  componentDidMount() {
    // Tell the D3 bar chart the size of the containing element, thus making 
    // the chart "responsive". This has to be done in componentDidMount() 
    // because the size of the div is unknown before mounting.
    this.setSize();
    // do the same on window resize
    window.addEventListener('resize', () => {
      this.setSize();
    });

    var newData = [5, 8, 25, 16, 13, 35];
    setTimeout(() => {
      this.setState({
        data: newData,
      });
    }, 2000);
  }

  setSize() {
    var containerWidth = this.refs.container.clientWidth;
    this.setState({
      width: containerWidth
    });
  }

  render() {
    return (
      <div ref="container">
        <PageHeader>D3.js test page <small>A bar chart</small></PageHeader>
        <HtmlBarChart {...this.state} />
      </div>
    );
  }
}
