var webpack = require('webpack');
var ChunkManifestPlugin = require('chunk-manifest-webpack-plugin');
var ManifestPlugin = require('webpack-manifest-plugin');

var config = require('./common.config');


config.devtool = 'source-map';
config.output.filename = '[name].[chunkhash].js';

config.module.loaders.unshift(
  {
    test: /\.jsx$|\.js$/,
    exclude: /node_modules/,
    loaders: ['babel?stage=0&optional=runtime']
  }
);

config.plugins.push(
  new ChunkManifestPlugin({
    filename: 'chunk-manifest.json',
    manifestVariable: 'webpackManifest'
  }),
  new ManifestPlugin({
    fileName: 'manifest.json',
    basePath: '/static/'
  }),
  new webpack.optimize.UglifyJsPlugin({
    compress: {
      warnings: false,
    }
  }),
  new webpack.optimize.OccurenceOrderPlugin(),
  new webpack.optimize.DedupePlugin()
);


module.exports= config;
