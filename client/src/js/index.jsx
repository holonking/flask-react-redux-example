import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import ReactDOM from 'react-dom';

import './initialize.js'
import '../css/styles.css';
import Hello from './components/Hello.jsx'


var API = '/api/hello';

ReactDOM.render(
  <Hello source={API} />,
  document.getElementById('root')
);
