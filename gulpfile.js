/*jshint esnext:true*/
/*globals require:true, console, process*/
"use strict"; /* jshint -W097 */

var minimumNodeVersion = 4;
if(parseFloat(process.version.toString().replace(/[^\.0-9]/, '')) < minimumNodeVersion){
  console.error("FATAL ERROR: You need to have at least Node.js version " + minimumNodeVersion + " but you have " + process.version);
  process.exit(1);
}

var gulp       = require('gulp'),
    concat     = require('gulp-concat'),
    browserify = require('browserify'),
    postcss    = require('gulp-postcss'),
    replace    = require('gulp-replace'),
    source     = require("vinyl-source-stream"),
    babelify   = require('babelify'),
    glob       = require("glob"),
    fs         = require("fs");

var paths = {
  css:       './src/**/*.css',
  jsentry:   './src/js/index.js',
  lib:       './src/lib/**',
  image:     './src/image/**',
  html:      './src/*.html',
  ready:     './src/ready.js',
  configxml: './config.xml',
  dest:      './www',
};

gulp.task('js', function (){
    // Process JS files into ES5
    browserify({
     entries: './src/js/index.js',
     extensions: ['.js'],
     debug: true
    })
    .transform(babelify, {presets:["es2015", "react", "stage-0"]})
    .bundle()
    .pipe(source('bundle.js'))
    .pipe(gulp.dest(paths.dest));
});

gulp.task('css', function(){
    var processors = [
      require('postcss-import'),
      require('postcss-mixins'),
      require('postcss-simple-vars'),
      require('postcss-nested'),
      require('autoprefixer')({ browsers: ['last 2 versions', '> 2%'] })
    ];
    gulp.src(paths.css)
      .pipe(postcss(processors))
      .pipe(gulp.dest(paths.dest));
});

gulp.task('lib', function(){
    gulp.src(paths.lib)
      .pipe(gulp.dest(paths.dest + "/lib"));
});

gulp.task('image', function(){
    gulp.src(paths.image)
      .pipe(gulp.dest(paths.dest + "/image"));
});

gulp.task('html', function(){
    gulp.src(paths.html)
      //.pipe(replace(/<!--\#(.*?)\#-->/, ''))
      .pipe(gulp.dest(paths.dest));
});

gulp.task('ready', function(){
    gulp.src(paths.ready)
      .pipe(gulp.dest(paths.dest));
});

gulp.task('configxml', function(){
    gulp.src(paths.configxml)
      .pipe(gulp.dest(paths.dest));
});

gulp.task('locale', function (){
  var allStrings = {};
  glob("./src/i18n/*/strings.txt", function(er, files){
    var filesRemaining = files.length,
        readLang = function(path){
          var lang = path.replace(/^.*?i18n\//,'').replace(/\/strings.txt.*?$/,''),
              strings = {};

          allStrings[lang] = strings;
          fs.readFile(path, 'utf-8', function(err, data){
            var lines = data.split("\n");
            for(var i = 0; i < lines.length; i++){
              var line = lines[i],
                  equals = line.indexOf("=");
              if(equals >= 0) strings[ line.substr(0, equals) ] = line.substr(equals+1);
            }
            end();
          });
        },
        end = function(){
          filesRemaining--;
          if(filesRemaining > 0) return;
          fs.mkdir(paths.dest + '/i18n', function(e){
            if(e && e.code !== 'EEXIST') console.log(e);
            fs.writeFile(paths.dest + '/i18n/strings.json', JSON.stringify(allStrings, null, 2), 'utf-8');
          });
        };

    for(var i = 0; i < files.length; i++){
      readLang(files[i]);
    }
  });
});

gulp.task('default', ['js', 'css', 'lib', 'image', 'html', 'locale', 'ready', 'configxml']);

gulp.task('watch', function(){
  gulp.watch(['*','**'], ['default']);
});
