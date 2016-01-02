//import 'es5-shim/es5-shim';
//import 'babel-polyfill';
//import 'isomorphic-fetch';

import React from 'react';
import ReactDOM from 'react-dom';

import './initialize';
import '../css/styles.css';
import Router from './Router';


ReactDOM.render(
  Router,
  document.getElementById('root')
);
