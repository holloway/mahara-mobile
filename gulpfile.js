var gulp    = require('gulp'),
    babel   = require('gulp-babel'),
    cssnext = require('gulp-cssnext'),
    replace = require('gulp-replace');

gulp.task('js', function (){
    // Process JS files into ES5
    gulp.src(["./src/**/*.js", "!./src/lib/**"])
      .pipe(babel({
        plugins: ['transform-es2015-modules-amd'],
        presets: ['react', 'es2015']
      }))
      .pipe(gulp.dest("./dist"));
});

gulp.task('css', function(){
    gulp.src("src/**/*.css")
      .pipe(cssnext({
        compress: true
      }))
      .pipe(gulp.dest("./dist"));
});

gulp.task('libs', function(){
    gulp.src("src/libs/**")
      .pipe(gulp.dest("./dist/libs"));
});

gulp.task('images', function(){
    gulp.src("src/images/**")
      .pipe(gulp.dest("./dist/images"));
});

gulp.task('html', function(){
    gulp.src("src/*.html")
      //.pipe(replace(/<!--\#(.*?)\#-->/, ''))
      .pipe(gulp.dest("./dist"));
});

gulp.task('default', ['js', 'css', 'libs', 'images', 'html']);

gulp.task('watch', function(){
  gulp.watch(['*','**'], ['default']);
});
