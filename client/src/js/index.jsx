import React from 'react';
import ReactDOM from 'react-dom';

import './initialize'
import '../css/styles.css';
import Hello from './components/Hello'


var API = '/api/hello';

ReactDOM.render(
  <Hello source={API} />,
  document.getElementById('root')
);
