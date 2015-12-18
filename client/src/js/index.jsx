import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import ReactDOM from 'react-dom';

import '../css/styles.css';
import Hello from './components/Hello.jsx'


if (__DEV__) {
  console.warn('FRONTEND_DEBUG:', __DEV__)
}

var API = '/api/hello';

ReactDOM.render(
  <Hello source={API} />,
  document.getElementById('root')
);
