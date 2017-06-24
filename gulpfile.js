var gulp = require('gulp');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var coffee = require('gulp-coffee');
var sass = require('gulp-ruby-sass');
var rename = require('gulp-rename');
var es = require('event-stream');
var shell = require('gulp-shell');
var notify = require('gulp-notify');

/**
 * Config settings.
 */
var config = {
  sass: 'src/sass/*.scss',
  sassStyle: 'compressed',
  cssDest: 'css',
  js: 'src/js/*.js',
  coffee: 'src/coffee/*.coffee',
  jsDest: 'js',
  siteAlias: ''
};

/**
 * Allows us to just run gulp within our project.
 */
gulp.task('default', ['styles', 'scripts'], function() {
  // Watch for updates
  gulp.watch('src/*/*.{js,coffee}', ['scripts']);
  gulp.watch('src/*/*.scss', ['styles']);
  // Shall commands - clear drupal cache.
  gulp.watch('**/*.{php,inc,info}',['drush']);
});

/**
 * Compile SASS :)
 */
gulp.task('styles', function() {
  return gulp.src(config.sass)
    .pipe(sass({
      'sourcemap=none': true,
      noCache: true,
      compass: true,
      style: config.sassStyle
    }))
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest(config.cssDest))
    .pipe(notify({message: 'SCSS compiled'}));
});

/**
 * Minify JS
 * Run our coffee task first before minifying ( CoffeeScripts are JS :) )
 */
gulp.task('scripts', function() {
  // Compile our CoffeeScripts into memory.
  var coffeeScripts = gulp.src(config.coffee)
    .pipe(coffee());

  var js = gulp.src(config.js);

  // Grab all our JS files & merge with "memory".
  return es.merge(coffeeScripts, js)
    .pipe(concat('site.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest(config.jsDest))
    .pipe(notify({message: 'JS compiled'}));
});

gulp.task('drush', function() {
  return gulp.src('*.js', {read: false})
    .pipe(shell([
      'echo <%= f(file.path) %>',
      'ls -l <%= file.path %>',
      'drush'
    ], {
      templateData: {
        f: function (s) {
          return s.replace(/$/, '.bak')
        }
      }
    }))
});
