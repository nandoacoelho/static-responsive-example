'use strict';

import gulp from 'gulp';
import concat from 'gulp-concat';
import sass from 'gulp-sass';
import sassGlob from './sass_globbing';
import debug from 'gulp-debug';
import jade from 'gulp-jade';
import cssmin from 'gulp-cssmin';
import autoprefixer from 'gulp-autoprefixer';
import harp from 'harp';
import browserSync from 'browser-sync';
import csscomb from 'gulp-csscomb';
import data from 'gulp-data';

const reload = browserSync.reload;

/**
 * Harp Server
 */
gulp.task('app', () => {
    harp.server('./src', {
        port: 9000
    }, () => {
        browserSync({
            proxy: "localhost:9000"
        });

        gulp.watch(
            [
                './src/assets/styles/**/*.sass'
            ], ['sass']
        );

        gulp.watch(
            [
                './src/**/*.jade'
            ], ['jade']
        );

        gulp.watch(
            [
                './src/**/*.js'
            ], ['scripts-components']
        );

        gulp.watch("src/**/*", () => {
            reload({stream: true});
        });

        gulp.watch("src/assets/styles/**/*.sass", () => {
            reload("main.css", {stream: true});
        });

        gulp.watch(["src/**/*.jade", "src/**/*.json", "src/**/*.js"], () => {
            reload();
        });
    });
});

/**
 * Sass Globbing
 */
gulp.task('sass_globbing', () => {
    gulp.src([
        'generic/*.sass',
        'settings/*.sass',
        'base/*.sass',
        'tools/*.sass',
        'objects/*.sass',
        'components/*.sass',
        'components/**/*.sass',
        'trumps/*.sass',
        './**/*.sass',
        '!main.sass'
    ], {cwd: './src/assets/styles/'})
        .pipe(sassGlob(
            {
                path: 'main.sass'
            },
            {
                useSingleQuotes: true,
                signature: '// Partials included with grunt-sass-globbing.'
            }
        ))
        .pipe(gulp.dest('./src/assets/styles'));
});

/**
 * Sass
 */
gulp.task('sass', ['sass_globbing'], () => {
    gulp.src('./src/assets/styles/main.sass')
        .pipe(csscomb())
        .pipe(sass())
        .pipe(autoprefixer())
        .pipe(debug({title: 'sass:'}))
        .pipe(concat('main.css'))
        .pipe(cssmin())
        .on('error', sass.logError)
        .pipe(gulp.dest('./src/assets/styles/'))
        .pipe(browserSync.stream());
});

/**
 * Sass
 */
gulp.task('sass-deliver', ['sass_globbing'], () => {
    gulp.src('./src/assets/styles/main.sass')
        .pipe(csscomb())
        .pipe(sass())
        .pipe(autoprefixer())
        .pipe(debug({title: 'sass:'}))
        .pipe(concat('main.css'))
        .on('error', sass.logError)
        .pipe(gulp.dest('./src/assets/styles/'))
        .pipe(browserSync.stream());
});

/**
 * Scripts
 */
gulp.task('scripts-components', function() {
    gulp.src('./src/assets/scripts/components/*.js')
        .pipe(concat('bundle.js'))
        .pipe(gulp.dest('./src/assets/scripts/'));

});

/**
 * Scripts components
 */
gulp.task('scripts', ['scripts-components'], function() {
    gulp.src([
        './src/assets/scripts/vendor/*.js',
    ])
        .pipe(concat('vendor.js'))
        .pipe(gulp.dest('./src/assets/scripts/'));
});

/**
 * Jade
 */
gulp.task('jade-modules', (done) => {
    gulp.src('./src/*.jade')
        .pipe(data(function(file) {
            return require('./harp.json').globals;
        }))
        .pipe(jade({
            pretty: true
        }))
        .pipe(debug({title: 'jade modules:'}))
        .pipe(gulp.dest('./deploy'))
        .pipe(browserSync.stream())
        .on('end', done);
});

/**
 * Deploy Styles
 */
gulp.task('deploy-styles', () => {
    gulp.src(
        [
            './src/assets/styles/main.css',
        ]
    )
        .pipe(gulp.dest('./deploy/assets/styles/'));
});

/**
 * Deploy Assets
 */
gulp.task('deploy-assets', () => {
    gulp.src(
        [
            '!./src/assets/styles/**/*.*',
            '!./src/assets/scripts/vendor/*.*',
            '!./src/assets/scripts/components/*.*',
            './src/assets/**/*.*',
        ]
    )
        .pipe(gulp.dest('./deploy/assets/'));
});

/**
 * Deliver Assets
 */
gulp.task('build-assets', () => {
    gulp.src(
        [
            '!./src/assets/styles/**/*.*',
            '!./src/assets/scripts/bundle.js',
            '!./src/assets/scripts/vendor.js',
            './src/assets/**/*.*',
        ]
    )
        .pipe(gulp.dest('./deploy/assets/'));
});

gulp.task('server', ['app']);

gulp.task('jade', ['jade-modules']);

gulp.task('default', ['sass', 'scripts', 'server']);

gulp.task('build', [
    'jade-modules',
    'deploy-styles',
    'build-assets',
    'sass',
    'scripts'
], () => {});

gulp.task('deliver', [
    'jade-modules',
    'deploy-styles',
    'build-assets',
    'sass-deliver',
    'scripts'
], () => {});