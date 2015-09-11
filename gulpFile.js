var gulp = require('gulp'),
    autoprefixer = require('gulp-autoprefixer'),
    del = require('del'),
    less = require('gulp-less');

var angularPath = 'extension/contentScript/app/';

gulp.task('clean', function(cb) {
    del([angularPath+'build/**/*', 'build/**/*', 'dist/**/*'], cb);
});

gulp.task('compileLess', function() {
    return gulp.src(angularPath+'less/main.less')
        .pipe(less())
        .pipe(gulp.dest(angularPath+'build'));
});

gulp.task('autoprefix', ['compileLess'], function () {
    return gulp.src(angularPath+'build/main.css')
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(gulp.dest(angularPath+'build/'));
});

gulp.task('watch', function() {
    gulp.watch(angularPath+'less/**/*.less', ['less']);
});

gulp.task('less', ['compileLess', 'autoprefix']);

gulp.task('build', ['clean', 'less'], function() {
    gulp.src('./assets/**/*')
        .pipe(gulp.dest('build/assets'));
    gulp.src('./extension/**/*')
        .pipe(gulp.dest('build/extension'));
    gulp.src(['icon.png', 'config.json', 'manifest.json', 'package.json', 'license.txt'])
        .pipe(gulp.dest('build/'));
});

gulp.task('default', ['clean', 'less']);