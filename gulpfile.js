'use strict';

const gulp = require('gulp');
const $ = require('gulp-load-plugins')({pattern:['gulp-*']});


gulp.task('js-with-option', function () {
	return gulp.src('src/js/**/*.js')
		.pipe($.plumber())
		.pipe($.babel({presets: ['es2015']}))
		.pipe($.concat('stile-full.min.js'))
		.pipe($.uglify())
		.pipe(gulp.dest('dist/js'));
});

gulp.task('js-without-option', function () {
	return gulp.src(['src/js/basic/*.js', 'src/js/content/*.js'])
		.pipe($.plumber())
		.pipe($.babel({presets: ['es2015']}))
		.pipe($.concat('stile.min.js'))
		.pipe($.uglify())
		.pipe(gulp.dest('dist/js'));
});

gulp.task('js-each', function () {
	return gulp.src('src/js/*/*.js')
		.pipe($.plumber())
		.pipe($.babel({presets: ['es2015']}))
		.pipe($.uglify())
		.pipe($.rename({extname: '.min.js'}))
		.pipe(gulp.dest('dist/js'));
});

gulp.task('js', ['js-with-option', 'js-without-option', 'js-each']);

gulp.task('sass', function () {
	return gulp.src(['src/sass/**/*.scss'], {base: 'src/sass'})
		.pipe($.plumber())
		.pipe($.changed('dist/sass'))
		.pipe(gulp.dest('dist/sass'));
});

gulp.task('watch', function () {
	gulp.watch('src/js/**/*.js', ['js']);
	gulp.watch('src/sass/**/*.scss', ['sass']);
});

gulp.task('build', ['js', 'sass']);

gulp.task('default', ['build', 'watch']);


// -----------------------------------------------------------------------------

gulp.task('docs-sass', ['sass'], function () {
	return gulp.src('docs/style.scss')
		.pipe($.plumber())
		.pipe($.sourcemaps.init())
		.pipe($.autoprefixer(['ie >= 11']))
		.pipe($.sass({outputStyle: 'compressed'}))
		.pipe($.rename({extname: '.min.css'}))
		.pipe($.sourcemaps.write('.'))
		.pipe(gulp.dest('docs'));
});

gulp.task('docs-js', ['js-with-option'], function () {
	return gulp.src(['dist/js/stile-full.min.js'])
		.pipe($.plumber())
		.pipe(gulp.dest('docs'));
});

gulp.task('docs', ['default'], () => {
	gulp.watch('src/js/**/*.js',     ['docs-js']);
	gulp.watch('src/sass/**/*.scss', ['docs-sass']);
	gulp.watch('docs/style.scss',    ['docs-sass']);
});
