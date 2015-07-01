var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');
var config = require('./webpack.config');

var server = new WebpackDevServer(webpack(config), {
  contentBase: './src/html',
  publicPath: config.output.publicPath,
  hot: true,
  historyApiFallback: true,
  stats: { colors: true },
});

var port = config.devServerPort;
server.listen(port, 'localhost', function () {
  console.log('Listening at localhost:' + port);
});
