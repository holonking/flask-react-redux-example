import React, { Component } from 'react';
import { PageHeader } from 'react-bootstrap';



export default class Docs extends Component {
  render() {
    return (
      <div class="container">
        <PageHeader>D3.js test page <small>Subtext for header</small></PageHeader>
        <p>An inverted navbar is black instead of gray.</p>
      </div>
    );
  }
}
