import React, { Component } from 'react';


export default class Hello extends Component {
  constructor(props) {
    super(props);
    // initial state:
    this.state = {text: "Nothing received yet"};
  }

  componentDidMount() {
    var url = this.props.source;
    fetch(url)
    .then(function(res) {
      if (__DEV__) {
        console.log('res:', res);
      }
      return res.json();
    })
    .then(function(data) {
      if (__DEV__) {
        console.log('data:', data);
      }

      // set new state when data arrives:
      data = JSON.stringify(data);
      this.setState({
        text: 'Received: ' + data
      });
    }.bind(this));
  }

  render() {
    return (
      <div className="hello">
        {this.state.text}
      </div>
    );
  }
}
