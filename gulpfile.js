'use strict'

var gulp = require('gulp');

// include plug-ins
var jshint = require('gulp-jshint');
var sass   = require('gulp-sass');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var browserSync = require('browser-sync');
var reload = browserSync.reload;

// JS hint task
gulp.task('jshint', function() {
  gulp.src('app/scripts/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

// Compile Our Sass
gulp.task('sass', function() {
    return gulp.src('app/styles/*.scss')
        .pipe(sass())
        .pipe(gulp.dest('css'));
});

// Concatenate & Minify JS
gulp.task('scripts', function() {
    return gulp.src('app/scripts/*.js')
        .pipe(concat('all.js'))
        .pipe(gulp.dest('dist'))
        .pipe(rename('all.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('dist'));
});

// Watch Files For Changes
gulp.task('watch', function() {
    gulp.watch('app/scripts/*.js', ['jshint', 'scripts']);
    gulp.watch('app/styles/*.scss', ['sass']);
    gulp.watch('app/styles/*.css', reload);
});

// Watch Files For Changes & Reload
gulp.task('serve', function () {
    browserSync.init(null, {
        server: {
            baseDir: ['app', '.tmp']
        },
        notify: false
    });

    gulp.watch('app/scripts/*.js', ['jshint', 'scripts']);
    gulp.watch('app/styles/*.scss', ['sass']);
    gulp.watch('app/styles/*.css', reload);
});

// Default Task
gulp.task('default', ['jshint', 'sass', 'scripts', 'watch']);