var express = require('express');
var url = require('url');
var request = require('request');

var devConfig = require('./webpack_config/webpack.dev.config.js');

var port = devConfig.devServerPort;
var host = devConfig.devServerHost;
var backendPort = devConfig.backendServerPort;
var backendHost = devConfig.backendServerHost;


var static_router = express.Router();
static_router.get(/\/.*(\.js|\.css)$/, function(req, res, next) {
  var parsedUrl = url.parse(req.url);
  parsedUrl.pathname += '.gz';
  req.url = url.format(parsedUrl);
  res.set('Content-Encoding', 'gzip');

  var contentTypes = {
    '.js': 'application/javascript',
    '.css': 'text/css',
  };
  res.set('Content-Type', contentTypes[req.params[0]]);

  next();
});
static_router.get(/\/.*/, express.static(__dirname + '/build/static', {
  maxAge: '300 days',
}));


var proxy_router = express.Router();
// both proxy_router.all() and proxy_router.use() can be used here, but the 
// path should be different
proxy_router.all(/\/.*/, function(req, res) {
  //console.log('proxying...');
  //console.log('req.url', req.url);
  //console.log('baseUrl:', req.baseUrl);
  //console.log('originalUrl:', req.originalUrl);

  var backendUrl = 'http://' + backendHost + ':' + backendPort;
  backendUrl += req.originalUrl;
  // TODO: lacks error handling here, try...catch won't help
  req.pipe(request(backendUrl)).pipe(res);
});


var app = express();

app.use('/static', static_router);
app.use('/api', proxy_router);

app.get('/*', function(req, res) {
  res.set('Content-Encoding', 'gzip');
  res.set('Content-Type', 'text/html');
  res.sendFile(__dirname + '/build/index.html.gz', {
    maxAge: '5 minutes',
  });
});

module.exports = app;


function main() {
  var server = app.listen(port, host, function() {
    //var host = server.address().address;
    //var port = server.address().port;
    console.log("Serving static files at: http://%s:%s", host, port);
  });
}

if (require.main === module) {
  main();
}

