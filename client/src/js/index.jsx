import React from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

import './initialize'
import '../css/styles.css';
import Router from './Router'


ReactDOM.render(
  Router,
  document.getElementById('root')
);
