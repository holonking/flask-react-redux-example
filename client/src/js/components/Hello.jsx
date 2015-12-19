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
        console.warn('__DEV__:', 'res:', res);
      }
      if (res.ok) {
        var data = res.json();
      } else {
        throw {msg: 'bad response', stats: res.status};
      }
      return data;
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
    }.bind(this))
    .catch(function(error) {
      console.error("Sth is wrong:", error)
    });
  }

  render() {
    return (
      <div className="hello">
        {this.state.text}
      </div>
    );
  }
}
