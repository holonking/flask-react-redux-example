var webpack = require('webpack');
var _ = require('lodash');
var ChunkManifestPlugin = require('chunk-manifest-webpack-plugin');
var ManifestPlugin = require('webpack-manifest-plugin');
var ExtractTextPlugin = require("extract-text-webpack-plugin");

var commonConfig = require('./common.config');


var globalVars = {
  __NODE__: false,
};

var productionConfig = {
  devtool: 'source-map',

  entry: {
    app: [
      //'babel-polyfill',
      './src/js/index',
    ],
  },
  output: {
    filename: '[name].[chunkhash].js'
  },

  plugins: [
    new webpack.DefinePlugin(globalVars),
    new ExtractTextPlugin('[name].[chunkhash].css'),

    new ChunkManifestPlugin({
      filename: 'chunk-manifest.json',
      manifestVariable: 'webpackManifest'
    }),
    new ManifestPlugin({
      fileName: 'manifest.json',
      basePath: '/static/'
    }),

    //new webpack.ContextReplacementPlugin(/moment\/locale$/, /zh-cn/),

    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false,
      }
    }),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.optimize.DedupePlugin()
  ],
  module: {
    loaders: [
      {
        test: /\.jsx$|\.js$/,
        exclude: /node_modules/,
        loaders: ['babel']
      }
    ],
  }
}

//config.devtool = 'source-map';
//config.output.filename = '[name].[chunkhash].js';

//config.module.loaders.unshift(
//  {
//    test: /\.jsx$|\.js$/,
//    exclude: /node_modules/,
//    loaders: ['babel?stage=0&optional=runtime']
//  }
//);

//config.plugins.push(
//  new ChunkManifestPlugin({
//    filename: 'chunk-manifest.json',
//    manifestVariable: 'webpackManifest'
//  }),
//  new ManifestPlugin({
//    fileName: 'manifest.json',
//    basePath: '/static/'
//  }),
//  new webpack.optimize.UglifyJsPlugin({
//    compress: {
//      warnings: false,
//    }
//  }),
//  new webpack.optimize.OccurenceOrderPlugin(),
//  new webpack.optimize.DedupePlugin()
//);

var config = _.merge({}, commonConfig, productionConfig, function(a, b) {
  if (_.isArray(a)) {
    return a.concat(b);
  }
});


module.exports = config;




