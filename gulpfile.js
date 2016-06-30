var gulp  = require('gulp'),
    sass  = require('gulp-sass'),
    gutil = require('gulp-util');

var fs = require('fs');
var exec = require('child_process').exec;
var manifest = require('./src/manifest.json');

var version = manifest.version;
var pkgName = "retabber-" + version + ".crx";

gulp.task('default', ['watch']);

gulp.task('compile-sass', function(){
  gulp.src("scss/*.scss")
    .pipe(sass())
    .pipe(gulp.dest('src/'));
});

gulp.task('watch', function() {
  gulp.watch("scss/*.scss", ['compile-sass']);
})

// Delete duplicate build
gulp.task('delete-build', function() {
  var pkgPath = "dist/" + pkgName; 

  fs.exists(pkgPath, function(exists) {
    if(exists) { fs.unlink(pkgPath, function() {}) }
  });
})

gulp.task('build', ['delete-build'], function() {
  exec('./crxmake.sh retabber src dist/retabber.pem');

  gulp.src('retabber.crx', { base: './' })
    .pipe(gulp.dest("dist/retabber-" + version + ".crx"))
});

