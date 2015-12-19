var webpack = require('webpack');
var _ = require('lodash');
var ExtractTextPlugin = require("extract-text-webpack-plugin");

var commonConfig = require('./common.config');


var globalVars = {
  __NODE__: false,
};

var devServerPort = 3000;
var backendServerPort = 3001;
var devServerHost = '0.0.0.0';

var devConfig = {
  devtool: 'eval-source-map',

  devServerPort: devServerPort,
  backendServerPort: backendServerPort,
  devServerHost: devServerHost,

  entry: {
    app: [
      'webpack-dev-server/client?http://' + devServerHost + ':' + devServerPort,
      'webpack/hot/only-dev-server',
      //'babel-polyfill',
      './src/js/index',
    ],
  },
  output: {
    filename: '[name].js'
  },

  plugins: [
    new webpack.DefinePlugin(globalVars),
    new ExtractTextPlugin('[name].css'),

    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
  ],

  module: {
    loaders: [
      {
        test: /\.jsx$|\.js$/,
        exclude: /node_modules/,
        loaders: ['react-hot', 'babel']
      }
    ],
  },
};


var config = _.merge({}, commonConfig, devConfig, function(a, b) {
  if (_.isArray(a)) {
    return a.concat(b);
  }
});


module.exports = config;


//module.exports = {
//  getConfig: function () {
//      return _merge({}, ..) 
//  }
//}

