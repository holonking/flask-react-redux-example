var path = require('path');
var webpack = require('webpack');
var CommonsChunkPlugin = require('webpack/lib/optimize/CommonsChunkPlugin');

devServerPort = 3000;
devServerHost = 'localhost';

module.exports = {
  devtool: 'eval-source-map',
  devServerPort: devServerPort,
  devServerHost: devServerHost,
  entry: {
    app: [
      'webpack-dev-server/client?http://' + devServerHost + ':' + devServerPort,
      'webpack/hot/only-dev-server',
      './src/js/index'
    ],
    vendor: [
      'react',
      'redux'
    ]
  },
  output: {
    path: path.join(__dirname, 'build'),
    filename: '[name].js',
    publicPath: '/static/'
  },
  plugins: [
    new CommonsChunkPlugin({
      name: 'vendor',
      minChunks: Infinity
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin()
  ],
  resolve: {
    extensions: ['', '.js', '.jsx']
  },
  module: {
    loaders: [
      {
        test: /\.jsx$/,
        include: path.resolve(__dirname, 'src/js'),
        loaders: ['react-hot', 'babel?stage=0']
      },
      {
        test: /\.css$/,
        include: path.resolve(__dirname, 'src/css'),
        loaders: ['style', 'css']
      },
      {
        test: /\.png$|\.jpe?g$/,
        include: path.resolve(__dirname, 'src/images'),
        loader: 'url'
      }
    ]
  }
};


