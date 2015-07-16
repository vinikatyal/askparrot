var gulp = require("gulp");
var browserify = require("browserify")
var source       = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
var gutil = require('gulp-util');
var less = require('gulp-less');
var minifycss = require('gulp-minify-css');
var process      = require('process');
var del = require('del');
var rename = require('gulp-rename');

process.env.BROWSERIFYSHIM_DIAGNOSTICS=1;

var src_js = "./src/js/app.js";
var src_less = "./src/styles/main.less";
var image_paths = [
  './src/images/**/*'
];
var static_paths = [
  './src/static/**/*'
];


function get_dist_path(val) {
  return ("./dist/" + val + "/");
}

var hbsfy = require('hbsfy').configure({
extensions: ['html']
});

gulp.task('clean', function(cb) {
  del("./dist/",cb);
});

gulp.task('images', function () {
    return gulp.src('src/images/**/*')
               .pipe(gulp.dest(get_dist_path("img")));
});

gulp.task('static', function() {
     return gulp.src(static_paths)
         .pipe(gulp.dest(get_dist_path("")));
});

gulp.task('css', function() {
    return gulp.src(src_less)
               .pipe(sourcemaps.init({loadMaps : true}))
               .pipe(less())
               .pipe(minifycss())
               .on('error', gutil.log)
               .pipe(sourcemaps.write('./'))
               .pipe(gulp.dest(get_dist_path("css")));
});

gulp.task('javascript', function(){
    return browserify({
        debug: true,
        transform: [hbsfy],
        entries: [src_js],
    })
    .bundle()
    .pipe(source('bundle.js'))
    .pipe(buffer())
    .pipe(sourcemaps.init({loadMaps : true}))
    .pipe(uglify())
    .on('error', gutil.log)
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest(get_dist_path("js")));
});

gulp.task('default', function() {
    // place code for your default task here
});

gulp.task('build', ['javascript','css','images','static']);
