var gulp = require('gulp');
var clean = require('gulp-clean');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');

gulp.task('clean', [], function () {
  return gulp
    .src('./dist/*', {
      read: false,
    })
    .pipe(clean());
});

gulp.task('scripts', function () {
  return gulp
    .src(['./src/js/*.js'])
    .pipe(
      concat({
        path: 'bundle.js',
        stat: {
          mode: 0666,
        },
      })
    )
    .pipe(rename('bundle.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('./dist/js'));
});

gulp.task('copy', function () {
  gulp.src(['./src/css/**/*']).pipe(gulp.dest('./dist/css'));
  gulp.src(['./src/data/*']).pipe(gulp.dest('./dist/data'));
  gulp.src(['./src/images/*']).pipe(gulp.dest('./dist/images'));
  gulp.src(['./src/index.html']).pipe(gulp.dest('./dist/'));
  gulp.src(['./src/CNAME']).pipe(gulp.dest('./dist/'));
});
