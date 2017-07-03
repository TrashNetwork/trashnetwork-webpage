var gulp = require('gulp'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    concat = require('gulp-concat'),
    header = require('gulp-header'),
    pkg = require('./package.json'),
    minifyCSS = require('gulp-clean-css'),
    watch = require('gulp-watch'),
    minifyHTML = require('gulp-minify-html');

gulp.task('scripts', function() {
    gulp.src([
        'bower_components/jquery/dist/jquery.js', // if you need jquery, use "npm i -g bower" and "bower install jquery"
        //'bower_components/bootstrap/dist/js/bootstrap.js', // if you need bootstrap, use "npm i -g bower" and "bower install bootstrap"
        'src/scripts/**/*.js' // our js files
    ])
        .pipe(concat('trashnetwork.js')) // cancatenation to file myproject.js
        .pipe(uglify()) // uglifying this file
        .pipe(rename({suffix: '.min'})) // renaming file to myproject.min.js
        .pipe(header('/*! <%= pkg.name %> <%= pkg.version %> */\n', {pkg: pkg} )) // banner with version and name of package
        .pipe(gulp.dest('./dist/js/')) // save file to destination directory
});

gulp.task('styles', function() {
    gulp.src([
        'bower_components/weui/dist/style/weui.css',
        //'bower_components/bootstrap/dist/css/bootstrap.css', // example with installed bootstrap package
        //'bower_components/bootstrap/dist/css/bootstrap-theme.css', // example with installed bootstrap package
        'src/styles/**/*.css' // our styles
    ])
        .pipe(concat('trashnetwork.css')) // concatenation to file myproject.css
        .pipe(minifyCSS({keepBreaks:false})) // minifying file
        .pipe(rename({suffix: '.min'})) // renaming file to myproject.min.css
        .pipe(header('/*! <%= pkg.name %> <%= pkg.version %> */\n', {pkg: pkg} )) // making banner with version and name of package
        .pipe(gulp.dest('./dist/css/')) // saving file myproject.min.css to this directory
});

gulp.task('pages',function() {
    var opts = {comments:false,spare:false,quotes:true};
        gulp.src('./src/*.html')
            .pipe(minifyHTML(opts))
            .pipe(gulp.dest('./dist/'));
});

gulp.task('watcher', function() {
    gulp.src('src/scripts/**/*.js')
        .pipe(watch('src/scripts/**/*.js', function(event) { // if changed any file in "src/scripts" (recursively)
            gulp.run('scripts'); // run task "scripts"
        }));
    gulp.src('src/styles/**/*.css')
        .pipe(watch('src/styles/**/*.css', function(event) {
            gulp.run('styles');
        }));
    gulp.src('src/*.html')
        .pipe(watch('src/*.html', function(event) {
            gulp.run('pages');
        }));
});


gulp.task('default', ['scripts', 'styles', 'pages']); // start default tasks "gulp"
gulp.task('watch', ['watcher']); // start watcher task "gulp watch"
