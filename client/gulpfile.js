var gulp = require('gulp');
var del = require('del');
var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');
   
var devConfig = require('./webpack_config/webpack.dev.config.js');
var productionConfig = require('./webpack_config/webpack.production.config.js');


//gulp.task('clean-all', function(cb) {
//  del([
//    'build/**/*',
//  ], cb);
//});

gulp.task('clean-client', function(cb) {
  del([
    'build/static/*',
  ], cb);
});
   
gulp.task('copy-index', function() {
  var stream = gulp.src('./src/html/index.html')
    .pipe(gulp.dest('./build/'));
  return stream;
});
   
gulp.task('build-client', ['clean-client'], function(cb) {
  var compiler = webpack(productionConfig);
  compiler.run(function(err, stats) {
    if (err) {
      console.log("Error:", err);
    } else {
      console.log(stats.toString({
        colors: true
      }));
    }
    cb();  
  });
});
 
gulp.task('build', ['build-client', 'copy-index']);

gulp.task('dev', function() {
  var port = devConfig.devServerPort;
  var host = devConfig.devServerHost;
  var server = new WebpackDevServer(webpack(devConfig), {
    contentBase: './src/html',
    publicPath: devConfig.output.publicPath,
    hot: true,
    historyApiFallback: true,
    stats: { colors: true },
    //proxy: [
    //  {
    //    path: /\/api\/(.*)/,
    //    target: 'http://' + host + ':' + (port + 1),
    //  }
    //],
  });

  server.listen(port, host, function(err) {
    if (err) {
      console.log('WebpackDevServer error:', err);
    } else {
      console.log('Listening at ' + host + ':' + port);
    }
  });
});






