import React, { Component } from 'react';
import { PageHeader } from 'react-bootstrap';
import ReactFauxDOM from 'react-faux-dom';
import d3 from 'd3';


export default class Docs extends Component {
  componentDidMount() {
    var data = [4, 8, 15, 16, 23, 42];
    var x = d3.scale.linear()
        .domain([0, d3.max(data)])
        .range([0, 420]);

    d3.select(".D3--chart")
    .selectAll("div")
      .data(data)
    .enter().append("div")
      .style("width", function(d) { return x(d) + "px"; })
      .text(function(d) { return d; });
  }

  render() {
    return (
      <div>
        <PageHeader>D3.js test page <small>A bar chart</small></PageHeader>
        <div className="D3--chart"></div>
      </div>
    );
  }
}
