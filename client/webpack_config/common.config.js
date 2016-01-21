var path = require('path');
var webpack = require('webpack');
var ExtractTextPlugin = require("extract-text-webpack-plugin");


var globalVars = {
  __DEV__: process.env.FRONTEND_DEBUG == 'on',
  __WEINRE__: process.env.WEINRE_ADDR !== undefined ?
    // the DefinePlugin uses string directly as *code fragment*, so we have to 
    // quote it:
    JSON.stringify(process.env.WEINRE_ADDR) : false,
};

module.exports = {
  // non-webpack configs
  globalVars: globalVars,

  // webpack configs
  entry: {
    runtime: [],
    vendor: [
      'es5-shim/es5-shim',
      'babel-polyfill',
      'isomorphic-fetch',

      'react',
      'react-dom',
      'react-router',
      'react-redux',
      'react-motion',
      'redux',
      'redux-thunk',
      'redux-simple-router',
      'history',
      'classnames',
      'loglevel',

      //'bootstrap/dist/css/bootstrap.min.css',
      'purecss/build/pure.css',
      'purecss/build/grids-responsive.css',
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
    //new webpack.DefinePlugin(globalVars),

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
        loaders: [
          'style',
          'css?modules&importLoaders=1' +
            '&localIdentName=[name]__[local]___[hash:base64:5]'
        ],
        //loader: ExtractTextPlugin.extract(
        //  'style',
        //  'css?modules&importLoaders=1' +
        //    '&localIdentName=[name]__[local]___[hash:base64:5]'
        //),
      },
      {
        test: /\.css$/,
        exclude: path.join(__dirname, '../src/js/'),
        loaders: ['style', 'css'],
        //loader: ExtractTextPlugin.extract('style', 'css'),
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



