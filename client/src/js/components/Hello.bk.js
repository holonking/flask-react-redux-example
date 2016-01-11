import React, { Component } from 'react';


var log = logger('Hello');
// use logger('Hello').setLevel('xxx') in chrome console to control debug level

const API = '/api/hello';

export default class Hello extends Component {
  constructor(props) {
    super(props);
    // initial state:
    this.state = {text: "Nothing received yet"};
  }

  componentDidMount() {
    var url = API;
    log.info('fetching data...');
    fetch(url)
    .then(function(res) {
      log.debug('res:', res);
      if (res.ok) {
        var data = res.json();
      } else {
        throw ['Bad response:', res];
      }
      return data;
    })
    .then(function(data) {
      log.debug('data:', data);

      // set new state when data arrives:
      data = JSON.stringify(data);
      this.setState({
        text: 'Received: ' + data
      });
    }.bind(this))
    .catch(function(error) {
      log.error("Sth is wrong:", error)
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
