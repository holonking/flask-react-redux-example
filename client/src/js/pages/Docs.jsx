import React, { Component } from 'react';


export default class Docs extends Component {
  render() {
    return (
      <div>
        <h1>{this.props.children}</h1>
      </div>
    );
  }
}
