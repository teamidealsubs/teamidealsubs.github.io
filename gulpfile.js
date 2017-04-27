// Define variables.
//var autoprefixer = require('autoprefixer');
var browserSync  = require('browser-sync').create();
var cleancss     = require('gulp-clean-css');
var concat       = require('gulp-concat');
var del          = require('del');
var gulp         = require('gulp');
var gutil        = require('gulp-util');
var imagemin     = require('gulp-imagemin');
//var notify       = require('gulp-notify');
//var postcss      = require('gulp-postcss');
var rename       = require('gulp-rename');
var run          = require('gulp-run');
var runSequence  = require('run-sequence');
//var sass         = require('gulp-ruby-sass');
var uglify       = require('gulp-uglify');

// Include paths file.
var paths = require('./_assets/gulp_config/paths');

// Processes SCSS.
gulp.task('build:styles', function() {
    return gulp.src([
        paths.sassFiles + '/lib' + '/**/*.css',
        paths.sassFiles + '/*.css'
    ])
        .pipe(concat('main.css'))
        .pipe(cleancss())
        .pipe(gulp.dest(paths.jekyllCssFiles))
        .pipe(gulp.dest(paths.siteCssFiles))
        .pipe(browserSync.stream())
        .on('error', gutil.log);
});

// Deletes CSS.
gulp.task('clean:styles', function(callback) {
    del([paths.jekyllCssFiles + 'main.css',
        paths.siteCssFiles + 'main.css'
    ]);
    callback();
});

// Processes JS.
gulp.task('build:scripts', function() {
    return gulp.src([
        paths.jsFiles + '/lib' + paths.jsPattern,
        paths.jsFiles + '/*.js'
    ])
        .pipe(concat('main.js'))
        .pipe(uglify())
        .pipe(gulp.dest(paths.jekyllJsFiles))
        .pipe(gulp.dest(paths.siteJsFiles))
        .on('error', gutil.log);
});

// Deletes processed JS.
gulp.task('clean:scripts', function(callback) {
    del([paths.jekyllJsFiles + 'main.js', paths.siteJsFiles + 'main.js']);
    callback();
});

// Copies fonts.
gulp.task('build:fonts', ['glyphicons']);

// Places Font Awesome fonts in proper location.
gulp.task('glyphicons', function() {
    return gulp.src(paths.fontFiles + '/glyphicons/**.*')
        .pipe(rename(function(path) {path.dirname = '';}))
        .pipe(gulp.dest(paths.jekyllFontFiles))
        .pipe(gulp.dest(paths.siteFontFiles))
        .pipe(browserSync.stream())
        .on('error', gutil.log);
});

// Deletes processed fonts.
gulp.task('clean:fonts', function(callback) {
    del([paths.jekyllFontFiles, paths.siteFontFiles]);
    callback();
});

// Optimizes images.
gulp.task('build:images', function() {
    return gulp.src(paths.imageFilesGlob)
        .pipe(imagemin())
        .pipe(gulp.dest(paths.jekyllImageFiles))
        .pipe(gulp.dest(paths.siteImageFiles))
        .pipe(browserSync.stream());
});

// Deletes processed images.
gulp.task('clean:images', function(callback) {
    del([paths.jekyllImageFiles, paths.siteImageFiles]);
    callback();
});

// Runs jekyll build command.
gulp.task('build:jekyll', function() {
    var shellCommand = 'bundle exec jekyll build --config _config.yml';

    return gulp.src('')
        .pipe(run(shellCommand))
        .on('error', gutil.log);
});

// Runs jekyll build command using test config.
gulp.task('build:jekyll:test', function() {
    var shellCommand = 'bundle exec jekyll build --config _config.yml,_config.test.yml';

    return gulp.src('')
        .pipe(run(shellCommand))
        .on('error', gutil.log);
});

// Runs jekyll build command using local config.
gulp.task('build:jekyll:local', function() {
    var shellCommand = 'bundle exec jekyll build --config _config.yml,_config.test.yml,_config.dev.yml';

    return gulp.src('')
        .pipe(run(shellCommand))
        .on('error', gutil.log);
});

// Deletes the entire _site directory.
gulp.task('clean:jekyll', function(callback) {
    del(['_site']);
    callback();
});

// Special tasks for building and then reloading BrowserSync.
gulp.task('build:jekyll:watch', ['build:jekyll:local'], function(callback) {
    browserSync.reload();
    callback();
});

gulp.task('build:scripts:watch', ['build:scripts'], function(callback) {
    browserSync.reload();
    callback();
});

// Main clean task.
// Deletes _site directory and processed assets.
gulp.task('clean', ['clean:jekyll',
    'clean:fonts',
    'clean:images',
    'clean:scripts',
    'clean:styles']);

// Builds site anew.
gulp.task('build', function(callback) {
    runSequence('clean',
        ['build:scripts', 'build:images', 'build:styles', 'build:fonts'],
        'build:jekyll',
        callback);
});

// Builds site anew using local config.
gulp.task('build:local', function(callback) {
    runSequence('clean',
        ['build:scripts', 'build:images', 'build:styles', 'build:fonts'],
        'build:jekyll:local',
        callback);
});

// Default Task: builds site.
gulp.task('default', ['build']);

// Static Server + watching files.
// Note: passing anything besides hard-coded literal paths with globs doesn't
// seem to work with gulp.watch().
gulp.task('serve', ['build:local'], function() {

    browserSync.init({
        server: paths.siteDir,
        ghostMode: false, // Toggle to mirror clicks, reloads etc. (performance)
        logFileChanges: true,
        logLevel: 'debug',
        open: false        // Toggle to automatically open page when starting.
    });

    // Watch site settings.
    gulp.watch(['_config.yml'], ['build:jekyll:watch']);

    // Watch .scss files; changes are piped to browserSync.
    gulp.watch('_assets/styles/**/*.scss', ['build:styles']);

    // Watch .js files.
    gulp.watch('_assets/js/**/*.js', ['build:scripts:watch']);

    // Watch image files; changes are piped to browserSync.
    gulp.watch('_assets/img/**/*', ['build:images']);

    // Watch posts.
    gulp.watch('_posts/**/*.+(md|markdown|MD)', ['build:jekyll:watch']);

    // Watch drafts if --drafts flag was passed.
    if (module.exports.drafts) {
        gulp.watch('_drafts/*.+(md|markdown|MD)', ['build:jekyll:watch']);
    }

    // Watch html and markdown files.
    gulp.watch(['**/*.+(html|md|markdown|MD)', '!_site/**/*.*'], ['build:jekyll:watch']);

    // Watch RSS feed XML file.
    gulp.watch('feed.xml', ['build:jekyll:watch']);

    // Watch data files.
    gulp.watch('_data/**.*+(yml|yaml|csv|json)', ['build:jekyll:watch']);

    // Watch favicon.png.
    gulp.watch('favicon.png', ['build:jekyll:watch']);
});
