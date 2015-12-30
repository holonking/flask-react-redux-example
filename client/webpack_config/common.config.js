var path = require('path');
var webpack = require('webpack');
var ExtractTextPlugin = require("extract-text-webpack-plugin");


var globalVars = {
  __DEV__: process.env.FRONTEND_DEBUG == 'on',
};

module.exports = {
  entry: {
    runtime: [],
    vendor: [
      'react',
      'react-dom',
      'react-router',
      'react-redux',
      'redux',
      'redux-thunk',
      'redux-simple-router',
      'history',
      'classnames',
      'loglevel',
      'babel-polyfill',
      'isomorphic-fetch',
      'bootstrap/dist/css/bootstrap.min.css',
    ],
    d3: [
      'd3',
    ],
  },
  output: {
    path: path.join(__dirname, '../build/static'),
    publicPath: '/static/'
  },

  plugins: [
    new webpack.DefinePlugin(globalVars),
    // The NamedModulesPlugin changes the module id format from number into 
    // file name, so we can get a more 'stable' vendor/d3 chunk.
    // See https://github.com/webpack/webpack/issues/1315.
    new webpack.NamedModulesPlugin(),

    // Also put the runtime into a separate chunk.
    new webpack.optimize.CommonsChunkPlugin({
      names: ['vendor', 'runtime'],
      minChunks: Infinity,
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'd3',
      // Has to be explicit on the chunks here. Should investigate the 
      // internals of CommonsChunkPlugin if have time.
      chunks: ['app'],
      minChunks: Infinity,
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
        include: path.join(__dirname, '../src/js/'),
        //loaders: [
        //  'style',
        //  'css?modules&importLoaders=1' +
        //    '&localIdentName=[name]__[local]___[hash:base64:5]'
        //],
        loader: ExtractTextPlugin.extract(
          'style',
          'css?modules&importLoaders=1' +
            '&localIdentName=[name]__[local]___[hash:base64:5]'
        ),
      },
      {
        test: /\.css$/,
        exclude: path.join(__dirname, '../src/js/'),
        //loaders: ['style', 'css'],
        loader: ExtractTextPlugin.extract('style', 'css'),
      },
      {
        test: /\.png$|\.jpe?g$/,
        loader: 'url'
      },
      {
        test: /\.svg$/,
        // use data-url for svg may result in a larger file size due to the 
        // base64 conversion, anyway, we still use it here
        loader: 'url?limit=10000'
      },
      {
        test: /\.woff2$/,
        loader: 'url?limit=50000'    
      },
      {
        test: /\.woff$|\.ttf$|\.eot$/,
        loader: 'file'
      },
    ]
  }
};



