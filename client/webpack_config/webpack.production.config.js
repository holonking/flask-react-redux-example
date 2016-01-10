var webpack = require('webpack');
var _ = require('lodash');

var ChunkManifestPlugin = require('chunk-manifest-webpack-plugin');
var ManifestPlugin = require('webpack-manifest-plugin');
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var CompressionPlugin = require("compression-webpack-plugin");

var commonConfig = require('./common.config');


var globalVars = _.merge({}, commonConfig.globalVars, {
  __SERVER__: false,
});

var productionConfig = {
  // non-webpack configs
  globalVars: globalVars,

  // webpack configs
  devtool: 'source-map',

  entry: {
    app: [
      './src/js/index',
    ],
  },
  output: {
    filename: '[name].[chunkhash].js',
    chunkFilename: '[name].[chunkhash].js'
  },

  plugins: [
    new webpack.DefinePlugin(globalVars),
    //new ExtractTextPlugin('[name].[chunkhash].css'),

    //new ChunkManifestPlugin({
    //  filename: 'chunk-manifest.json',
    //  manifestVariable: 'webpackManifest'
    //}),
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
    // XXX: The DedupePlugin seems to be broken:
    //new webpack.optimize.DedupePlugin(),

    new CompressionPlugin({
      asset: '{file}.gz',
      algorithm: 'gzip',
      regExp: /\.js$|\.css/,
      //threshold: 10000,
      //minRatio: 0.8
    })
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


var config = _.merge({}, commonConfig, productionConfig, function(a, b) {
  if (_.isArray(a)) {
    return a.concat(b);
  }
});


module.exports = config;




