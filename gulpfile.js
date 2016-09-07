const babel = require('gulp-babel');
const gulp = require('gulp');

gulp.task('build', ['compile', 'copyfiles']);
gulp.task('default', ['compile', 'copyfiles']);

gulp.task('compile', () => {
  return gulp.src('src/**/*.js')
    .pipe(babel({ presets: ['es2015', 'stage-0'] }))
    .pipe(gulp.dest('dist'));
});

gulp.task('copyfiles', () => {
  return gulp.src('src/**/*.csv')
    .pipe(gulp.dest('dist'));
});
