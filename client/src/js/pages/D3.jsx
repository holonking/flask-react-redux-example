import React, { Component } from 'react';
import { PageHeader } from 'react-bootstrap';
import ReactFauxDOM from 'react-faux-dom';
import d3 from 'd3';


export default class Docs extends Component {
  componentDidMount() {
    d3.select('.chart').append('div').html('<h3>Hello from D3</h3>');
  }

  render() {
    return (
      <div>
        <PageHeader>D3.js test page <small>Subtitle here</small></PageHeader>
        <div className="chart"></div>
      </div>
    );
  }
}
