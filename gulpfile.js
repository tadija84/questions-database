var gulp = require("gulp");
var sass = require("gulp-sass");
watch = require('gulp-watch');

gulp.task("sass", function () {
  return gulp
    .src("./scss/**/*.scss")
    .pipe(sass())
    .pipe(gulp.dest("./public/css"));
});

gulp.task("watch", function () {
  gulp.watch("./**/*.scss", gulp.series(["sass"]));
});