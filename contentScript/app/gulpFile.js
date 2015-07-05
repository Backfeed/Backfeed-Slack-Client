var gulp = require('gulp'),
    autoprefixer = require('gulp-autoprefixer'),
    del = require('del'),
    less = require('gulp-less');

gulp.task('clean', function(cb) {
    del('build/**/*', cb);
});

gulp.task('less', function() {
    return gulp.src('./less/main.less')
        .pipe(less())
        .pipe(gulp.dest('./build'));
});

gulp.task('autoprefix', ['less'], function () {
    return gulp.src('./build/main.css')
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(gulp.dest('build/'));
});

gulp.task('default', ['clean', 'less', 'autoprefix']);