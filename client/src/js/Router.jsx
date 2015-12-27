import React from 'react';
import { Router, Route, IndexRoute } from 'react-router';
import createBrowserHistory from 'history/lib/createBrowserHistory'

import App from './App';
import Home from './pages/Home';
import Docs from './pages/Docs';
//import D3 from './pages/D3';


export default (
  <Router history={createBrowserHistory()}>
    <Route path="/" component={App}>
      <IndexRoute component={Home} />
      <Route path="docs" component={Docs} />
      <Route path="d3" getComponent={(location, callback) => {
        require.ensure(['d3'], (require) => {
          callback(null, require('./pages/D3').default);
        });
      }} />
    </Route>
  </Router>
);

