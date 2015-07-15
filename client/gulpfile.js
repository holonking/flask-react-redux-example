var gulp = require('gulp');
var webpack = require('webpack');
var del = require('del');
   
var productionConfig = require('./webpack_config/webpack.production.config.js');


gulp.task('clean', function(cb) {
  del([
    'build/**/*',
  ], cb);
});
   
gulp.task('copy-index', ['clean'], function() {
  var stream = gulp.src('./src/html/index.html')
    .pipe(gulp.dest('./build/'));
  return stream;
});
   
gulp.task('webpack', ['clean'], function(cb) {
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
 
gulp.task('build', ['webpack', 'copy-index']);

