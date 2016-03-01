import React from 'react';
import { Router, Route, IndexRoute } from 'react-router';
import createBrowserHistory from 'history/lib/createBrowserHistory'

import App from './App';
import Home from './pages/Home';
import Docs from './pages/Docs';

//import D3 from './pages/D3';
var loadD3 = require('bundle?lazy&name=d3!d3');
var loadD3b = require('bundle?lazy&name=d3!d3');

export default (
  <Router history={createBrowserHistory()}>
    <Route path="/" component={App}>
      <IndexRoute component={Home} />
      <Route path="docs" component={Docs} />
      <Route path="d3" getComponent={(location, callback) => {
        loadD3(() => {
          //require.ensure([], (require) => {
            callback(null, require('./pages/D3').default);
          //});
        });
      }} />
      <Route path="d3b" getComponent={(location, callback) => {
        loadD3b(() => {
          //require.ensure([], (require) => {
            callback(null, require('./pages/D3b').default);
          //});
        });
      }} />
      <Route path="jplot" getComponent={(location, callback) => {
        loadD3b(() => {
          //require.ensure([], (require) => {
            callback(null, require('./pages/JPlot').default);
          //});
        });
      }} />
    </Route>
  </Router>
);

