var gulp  = require('gulp'),
    sass  = require('gulp-sass'),
    gutil = require('gulp-util');

var fs = require('fs');
var execSync = require('sync-exec');
var manifest = require('./src/manifest.json');

var version = manifest.version;
var pkgName = "retabber-" + version + ".crx";
var pkgPath = "dist/" + pkgName; 

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
  fs.exists(pkgPath, function(exists) {
    if(exists) { fs.unlink(pkgPath, function() {}) }
  });
})

gulp.task('build', ['delete-build'], function() {
  execSync('./crxmake.sh retabber src dist/retabber.pem');
  fs.rename('./retabber.crx', pkgPath);
});

