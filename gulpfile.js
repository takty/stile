var gulp     = require('gulp');
var plumber  = require('gulp-plumber');
var concat   = require('gulp-concat');
var uglify   = require('gulp-uglify');
var rename   = require('gulp-rename');
var sass     = require('gulp-sass');
var cleanCSS = require('gulp-clean-css');
var flatten  = require('gulp-flatten');

gulp.task('js', function () {
	gulp.src(['src/js/basic/*.js', 'src/js/content/*.js'])
	.pipe(plumber())
	.pipe(concat('stile.min.js'))
	.pipe(uglify())
	.pipe(gulp.dest('dest/js'));

	gulp.src('src/js/**/*.js')
	.pipe(plumber())
	.pipe(concat('stile-full.min.js'))
	.pipe(uglify())
	.pipe(gulp.dest('dest/js'));

	gulp.src('src/js/*/*.js')
	.pipe(plumber())
	.pipe(uglify())
	.pipe(rename({extname: '.min.js'}))
	.pipe(gulp.dest('dest/js'));
});

gulp.task('sass', function () {
	gulp.src(['src/sass/**'], {base: 'src/sass'})
	.pipe(gulp.dest('dest/sass'));
});

gulp.task('watch', function() {
	gulp.watch('src/js/**/*.js', ['js']);
	gulp.watch('src/sass/**/*.scss', ['sass']);
});

gulp.task('default', ['js', 'sass', 'watch']);

gulp.task('sample', function () {
	gulp.src('sample/style.scss')
	.pipe(plumber())
	.pipe(sass())
	.pipe(cleanCSS())
	.pipe(gulp.dest('sample'));
});
