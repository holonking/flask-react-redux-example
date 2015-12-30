var gulp = require('gulp');
var fs = require('fs');
var glob = require('glob');
var del = require('del');
var extend = require('lodash/object/extend');

var handlebars = require('handlebars');
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
  return del([
    'build/static/*',
  ]);
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
 
gulp.task('gen-index', ['build-client'], function(cb) {
  var index = fs.readFileSync('./src/html/index.html.production', 'utf-8');
  var runtime_file = glob.sync('./build/static/runtime*.js')[0];
  var runtime = fs.readFileSync(runtime_file, 'utf-8');

  var data = JSON.parse(
    fs.readFileSync('./build/static/manifest.json', 'utf-8')
  );
  data = extend(data, {runtime_script: runtime});

  var template = handlebars.compile(index);
  var res = template(data);

  fs.writeFileSync('./build/index.html', res);
  cb();
});

gulp.task('build', ['build-client', 'gen-index']);

gulp.task('dev', function() {
  var port = devConfig.devServerPort;
  var backendPort = devConfig.backendServerPort;
  var host = devConfig.devServerHost;

  var server = new WebpackDevServer(webpack(devConfig), {
    contentBase: './src/html',
    publicPath: devConfig.output.publicPath,
    hot: true,
    historyApiFallback: true,
    stats: { colors: true },
    proxy: {
      '/api/*': {
        target: 'http://' + host + ':' + backendPort,
        secure: false,
      },
    },
    compress: true,
  });
  server.listen(port, host, function(err) {
    if (err) {
      console.log('WebpackDevServer error:', err);
    } else {
      console.log('Listening at ' + host + ':' + port);
    }
  });
});






