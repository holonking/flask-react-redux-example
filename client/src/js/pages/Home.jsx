import React, { Component } from 'react';
import { Link } from 'react-router';

//import { Jumbotron, Button } from 'react-bootstrap';

import Hello from '../components/Hello';


export default class Home extends Component {
  render() {
    return (
      <div>
        <h2 style={{marginBottom: '50px'}}><Hello /></h2>
        <p>
          <Link to="/docs" className="pure-button pure-button-primary">
            Learn more
          </Link>
        </p>
      </div>
    );
  }
}
