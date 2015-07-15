var webpack = require('webpack');

var config = require('./common.config');


var devServerPort = 3000;
var devServerHost = 'localhost';

config.devServerPort = devServerPort;
config.devServerHost = devServerHost;

config.devtool = 'eval-source-map';

config.entry.app.unshift(
  'webpack-dev-server/client?http://' + devServerHost + ':' + devServerPort,
  'webpack/hot/only-dev-server'
);

config.output.filename = '[name].js';

config.plugins.push(
  new webpack.HotModuleReplacementPlugin(),
  new webpack.NoErrorsPlugin()
);

config.module.loaders.unshift(
  {
    test: /\.jsx$|\.js$/,
    exclude: /node_modules/,
    loaders: ['react-hot', 'babel?stage=0&optional=runtime']
  }
);

module.exports= config;



