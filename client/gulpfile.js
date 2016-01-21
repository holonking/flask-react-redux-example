var fs = require('fs');
var stream = require('stream');
var glob = require('glob');
var del = require('del');
var mkdirp = require('mkdirp');
var gzip = require('zlib').createGzip();
var extend = require('lodash/object/extend');

var gulp = require('gulp');
var handlebars = require('handlebars');
var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');
   
var devConfig = require('./webpack_config/webpack.dev.config.js');
var productionConfig = require('./webpack_config/webpack.production.config.js');


gulp.task('clean-client', function() {
  return del([
    'build/static/*',
    'build/index.html*',
  ]);
});
   
//gulp.task('copy-index', function() {
//  var stream = gulp.src('./src/html/index.html')
//    .pipe(gulp.dest('./build/'));
//  return stream;
//});

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
 
//gulp.task('gen-index', [], function(cb) {
gulp.task('gen-index', ['build-client'], function(cb) {
  var index = fs.readFileSync('./src/html/index.html.production', 'utf-8');
  var runtimeFile = glob.sync('./build/static/runtime*.js')[0];
  var runtime = fs.readFileSync(runtimeFile, 'utf-8');

  var data = JSON.parse(
    fs.readFileSync('./build/static/manifest.json', 'utf-8')
  );
  data = extend(data, {runtime_script: runtime});

  var template = handlebars.compile(index);
  var res = template(data);

  fs.writeFileSync('./build/index.html', res);

  var rstream = new stream.Readable;
  rstream.push(res);
  rstream.push(null);

  var wstream = fs.createWriteStream('./build/index.html.gz');
  rstream.pipe(gzip).pipe(wstream);

  cb();
});

gulp.task('build', ['build-client', 'gen-index']);


gulp.task('clean-dev', function() {
  return del([
    'build/_dev/*',
  ]);
});

gulp.task('dev', ['clean-dev'], function() {
  var port = devConfig.devServerPort;
  var host = devConfig.devServerHost;
  var backendPort = devConfig.backendServerPort;
  var backendHost = devConfig.backendServerHost;

  var index = fs.readFileSync('./src/html/index.html.dev', 'utf-8');
  var template = handlebars.compile(index);
  var globalVars = devConfig.globalVars;
  if (globalVars.__WEINRE__) {
    var weinre = `<script src=${globalVars.__WEINRE__}></script>`;
    var res = template({weinre_script: weinre});
  } else {
    var res = template({weinre_script: ''});
  }
  mkdirp.sync('./build/_dev/');
  fs.writeFileSync('./build/_dev/index.html', res);

  var server = new WebpackDevServer(webpack(devConfig), {
    contentBase: './build/_dev/',
    publicPath: devConfig.output.publicPath,
    hot: true,
    historyApiFallback: true,
    stats: { colors: true },
    proxy: {
      '/api/*': {
        target: 'http://' + backendHost + ':' + backendPort,
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






