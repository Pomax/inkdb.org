var gulp = require('gulp');

// This is a realy cool thing about gulp:
require('./app/Gulpfile');

/**
 * our "default" task runs everything, but -crucially- it
 * runs the subtasks in order. That means we'll wait for
 * files to be written before we move on to the next task,
 * because in this case we can't run parallel tasks.
 */
gulp.task('default', ['app']);

/**
 * Meta watcher, starting all the watch task for the individual
 * apps, as well as shared resources that require linting/compilation.
 */
gulp.task('watch', ['watch-app', 'run-app']);
