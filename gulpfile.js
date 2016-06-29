var gulp  = require('gulp'),
    gutil = require('gulp-util'),
    sass  = require('gulp-sass');

gulp.task('default', ['watch']);

gulp.task('watch', function() {
  gulp.watch('scss/*.scss', ['compile-sass']);
})

gulp.task('compile-sass', function() {
  gulp.src('scss/*.scss')
    .pipe(sass())
    .pipe(gulp.dest('.'))
})
