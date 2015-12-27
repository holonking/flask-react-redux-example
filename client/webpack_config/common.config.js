var path = require('path');
var webpack = require('webpack');
var ExtractTextPlugin = require("extract-text-webpack-plugin");


var globalVars = {
  __DEV__: process.env.FRONTEND_DEBUG == 'on',
};

module.exports = {
  entry: {
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
      //'react-bootstrap',
      //'lodash',
      //'babel-polyfill',
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
    new webpack.optimize.CommonsChunkPlugin({
      //names: ['d3', 'vendor'],
      name: 'vendor',
      minChunks: Infinity,
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'd3',
      minChunks: Infinity,
      async: true,
      //children: true,
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
        //exclude: /node_modules/,
        include: path.join(__dirname, '../src/js/'),
        loader: ExtractTextPlugin.extract(
          'style',
          'css?modules&importLoaders=1' +
            '&localIdentName=[name]__[local]___[hash:base64:5]'
        )
      },
      {
        test: /\.css$/,
        exclude: path.join(__dirname, '../src/js/'),
        loader: ExtractTextPlugin.extract('style', 'css')
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



