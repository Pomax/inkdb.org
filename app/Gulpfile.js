var gulp = require('gulp');
var watch = require('gulp-watch');

// where are we running?
var path = require("path");
var cwd = path.dirname(__filename);


/**
 * Browserify bundling of app.
 */
gulp.task('bundle-app', function() {
  var browserify = require('browserify');
  var transform = require('vinyl-transform');
  var reactify = require('reactify');
  var to5ify = require("6to5ify");
  var source = require('vinyl-source-stream');

//  // Make sure we point to the dist/react.min.js version of react
//  var replacements = require('browserify-global-shim').configure({
//    'react': 'require("react/dist/react.min")'
//  });

  return browserify(cwd + '/components/app.jsx')
    .transform(to5ify)
    .transform(reactify)
//    .transform(replacements)
    .bundle()
    .pipe(source('app.js'))
    .pipe(gulp.dest(cwd + '/build/'));
});


/**
 * Minify app
 */
gulp.task('minify-app', ['bundle-app'], function() {
  var uglify = require('gulp-uglify');

  return gulp.src(cwd + '/build/app.js')
    //.pipe(uglify())
    .pipe(gulp.dest(cwd + '/public/javascript'));
});


// used in both the lint and watch tasks
var jsxSrc = [
  cwd + '/components/**/*.js*',
  cwd + '/mixins/**/*.js',
  '!' + cwd + '/lib/jpg.js',
  cwd + '/lib/**/*.js'
];


/**
 * Javascript and JSX linting
 */
gulp.task('lint-app', function() {
  // set up jshint to make use of jshint-jsx, as we're mixing
  // plain javascript with React's JSX.
  var jshint = require('gulp-jshint');
  var jsxhinter = require('jshint-jsx');
  jsxhinter.JSHINT = jsxhinter.JSXHINT;

  return gulp.src(jsxSrc)
    .pipe(jshint({ linter: 'jshint-jsx' }))
    .pipe(jshint.reporter('default'));
});


/**
 * JavaScript style validation, using JSCS
 */
gulp.task('jscs-app', function() {
  var jsxcs = require("gulp-jsxcs");
  return gulp.src("component/**/*.jsx")
    .pipe(jsxcs())
    .pipe(process.stdout);
});

var lessSrc = cwd + '/less/*.less';

/**
 * LESS compilation is independent of any other task
 */
gulp.task('less-app', function() {
  var less = require('gulp-less');
  var plumber = require('gulp-plumber');
  var sourcemaps = require('gulp-sourcemaps');

  return gulp.src([lessSrc])
      .pipe(plumber())
      .pipe(sourcemaps.init())
      .pipe(less())
      .pipe(sourcemaps.write())
      .pipe(gulp.dest(cwd + '/public/stylesheets'));
});


/**
 * our "default" task runs everything, but -crucially- it
 * runs the subtasks in order. That means we'll wait for
 * files to be written before we move on to the next task,
 * because in this case we can't run parallel tasks.
 */
gulp.task('app', ['lint-app', 'jscs-app', 'minify-app', 'less-app']);


gulp.task('run-app', function() {
  var liveServer = require("live-server");
  var dir = cwd + "/public";
  var suppressBrowser = false;
  liveServer.start(55555, dir, suppressBrowser);
});

/**
 * Automatic rebuilding when .jsx files are changed
 */
gulp.task('watch-app', function() {
  watch(jsxSrc, function() { gulp.start('lint-app'); });
  watch(jsxSrc, function() { gulp.start('minify-app'); });
  watch(lessSrc, function() { gulp.start('less-app'); });
});
