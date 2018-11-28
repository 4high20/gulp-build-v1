//declare dependencies

var gulp = require('gulp'),
  concat = require('gulp-concat'),
  uglify = require('gulp-uglify'),
  rename = require('gulp-rename'),
    maps = require('gulp-sourcemaps'),
    sass = require('gulp-sass'),
 resizer = require('gulp-images-resizer'),
     del = require('del'),
    csso = require('gulp-csso');
     runSequence = require('run-sequence'),
     browserSync = require('browser-sync').create();;

//concatenates the .js files into one file and then minify the file and place it in the dist folder
gulp.task("scripts", function() {
  return gulp.src([
    'js/global.js',
    'js/circle/autogrow.js',
    'js/circle/main.js'
  ])
  .pipe(maps.init())
  .pipe(concat('all.min.js'))
  //.pipe(gulp.dest('dist/scripts'))
  .pipe(uglify())
  .pipe(maps.write('./'))
  .pipe(gulp.dest('dist/scripts'))
});

//compile the main scss file and then minify the file and place it in the dist folder
gulp.task("styles", function() {
  return gulp.src("sass/global.scss")
  .pipe(maps.init())
  .pipe(sass())
  .pipe(concat('all.min.css'))
  .pipe(csso())
  .pipe(maps.write('./'))
  .pipe(gulp.dest('dist/styles'))
  .pipe(browserSync.reload({
    stream: true
  }))
});

//reside the images and place it in the dist folder
gulp.task("images", function() {
  return gulp.src(['images/*.png', 'images/*.jpg'])
  .pipe(resizer({
    width: "50%"
  }))
  .pipe(gulp.dest('dist/content'));
});

//delete the dist folder
gulp.task("clean", function() {
  del('dist');
});

//serve the website on port 3000
gulp.task('serve', function() {
  browserSync.init({
    server: {
      baseDir: "./",
      port: 3000
    }
  })
});

//if there is a change in any .scss file run the styles task and refresh the browser
gulp.task('watch', ['serve', 'styles'], function() {
  gulp.watch('sass/**/*.scss', ['styles']);
});

//run all the scripts required to build the project
gulp.task("build", function() {
  runSequence('clean', 'styles', 'scripts', 'images');
});

//build the project and watches for changes
gulp.task("default", function() {
  runSequence('build', 'watch');
});
