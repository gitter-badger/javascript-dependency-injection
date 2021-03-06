var gulp = require('gulp'),
    jshint = require('gulp-jshint'),
    filelog = require('gulp-filelog'),
    rename = require('gulp-rename'),
    uglify = require('gulp-uglify'),
    yuidoc = require("gulp-yuidoc"),
    jshint = require('gulp-jshint'),
    coveralls = require('gulp-coveralls'),
    options = {
        globals: {
            exports: true,
            console: true,
            DEBUG: true,
            window: true
        },
        laxcomma: true,
        strict: false,
        validthis: true,
        undef: true
    };

gulp.task('default', function () {
    gulp.src('di.js')
        .pipe(filelog())
        .pipe(jshint(options))
        .pipe(jshint.reporter('default'))
        .pipe(uglify())
        .pipe(rename('di.min.js'))
        .pipe(gulp.dest('.'));

    gulp.src("di.js")
      .pipe(yuidoc())
      .pipe(gulp.dest("./doc"));
});

gulp.task('lint', function() {
  return gulp.src('di.js')
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

gulp.task('test', function () {
    var karma = require('karma').server;

    karma.start({
        autoWatch: false,
        browsers: [
            'PhantomJS'
        ],
        coverageReporter: {
            type: 'lcov',
            dir: 'coverage/'
        },
        frameworks: [
            'jasmine'
        ],
        files: [
            'di.js',
            'tests/spec-helpers.js',
            'tests/di.spec.js'
        ],
        junitReporter: {
            outputFile: 'target/junit.xml'
        },
        preprocessors: {
            'di.js': 'coverage'
        },
        reporters: [
            'junit',
            'coverage'
        ],
        singleRun: true
    });
});

gulp.task('coveralls', ['test'], function () {
    gulp.src('coverage/**/lcov.info')
      .pipe(coveralls());
});