var path = require('path');
var webpack = require('webpack');
var CommonsChunkPlugin = require('webpack/lib/optimize/CommonsChunkPlugin');
var ExtractTextPlugin = require("extract-text-webpack-plugin");


var globalVars = {
  __DEV__: process.env.FRONTEND_DEBUG == 'on',
};

module.exports = {
  entry: {
    //app: [
    //  './src/js/index'
    //],
    vendor: [
      'react',
      'redux',
      'classnames',
      'lodash',
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
    //new ExtractTextPlugin('[name].css'),
  ],

  resolve: {
    extensions: ['', '.js', '.jsx']
  },
  module: {
    loaders: [
      {
        test: /\.css$/,
        loaders: ExtractTextPlugin.extract('style', 'css')
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



