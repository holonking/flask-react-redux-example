import React, { Component } from 'react';
import { PageHeader } from 'react-bootstrap';
import ReactFauxDOM from 'react-faux-dom';
import d3 from 'd3';

var log = logger('D3');


class HtmlBarChart extends Component {
  render() {
    var data = this.props.data;
    log.debug('data:', data);

    var x = d3.scale.linear()
        .domain([0, d3.max(data)])
        .range([0, 420]);

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
    var newData = [5, 8, 25, 16, 13, 35];
    setTimeout(() => {
      this.setState({
        data: newData,
      });
    }, 2000);
  }

  render() {
    return (
      <div>
        <PageHeader>D3.js test page <small>A bar chart</small></PageHeader>
        <HtmlBarChart data={this.state.data} />
      </div>
    );
  }
}
