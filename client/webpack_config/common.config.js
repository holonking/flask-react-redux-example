var path = require('path');
var webpack = require('webpack');
var CommonsChunkPlugin = require('webpack/lib/optimize/CommonsChunkPlugin');
var ExtractTextPlugin = require("extract-text-webpack-plugin");


var globalVars = {
  __DEV__: process.env.FRONTEND_DEBUG == 'on',
};

module.exports = {
  entry: {
    vendor: [
      'react',
      'redux',
      'classnames',
      'react-bootstrap',
      //'bootstrap/dist/css/bootstrap.min.css',
      'loglevel',
      //'lodash',
      //'babel-polyfill',
    ]
  },
  output: {
    path: path.join(__dirname, '../build/static'),
    publicPath: '/static/'
  },

  plugins: [
    new webpack.DefinePlugin(globalVars),
    new CommonsChunkPlugin({
      name: 'vendor',
      minChunks: Infinity
    }),
    //new webpack.ProvidePlugin({
    //  loglevel: 'loglevel'
    //})
  ],

  resolve: {
    extensions: ['', '.js', '.jsx']
  },

  module: {
    loaders: [
      {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract('style', 'css')
      },
      {
        test: /\.png$|\.jpe?g$/,
        loader: 'url'
      },
      {
        test: /\.woff2$/,
        loader: 'url?limit=50000'    
      },
      {
        test: /\.woff$|\.ttf$|\.eot$|\.svg$/,
        loader: 'file'
      },
    ]
  }
};



