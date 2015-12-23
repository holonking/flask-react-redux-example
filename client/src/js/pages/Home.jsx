import React, { Component } from 'react';
import { Jumbotron, Button } from 'react-bootstrap';
import { Link } from 'react-router';

import Hello from '../components/Hello';


export default class Home extends Component {
  render() {
    return (
      <Jumbotron>
        <h2 style={{marginBottom: '50px'}}><Hello /></h2>
        <p><Link to="/docs"><Button bsStyle="primary">Learn more</Button></Link></p>
      </Jumbotron>
    );
  }
}
