var gulp    = require('gulp');
var plumber = require('gulp-plumber');
var changed = require('gulp-changed');
var concat  = require('gulp-concat');
var uglify  = require('gulp-uglify');
var rename  = require('gulp-rename');
var babel   = require('gulp-babel');

var sass       = require('gulp-sass');
var cleanCSS   = require('gulp-clean-css');
var sourcemaps = require('gulp-sourcemaps');

gulp.task('js', function () {
	gulp.src(['src/js/basic/*.js', 'src/js/content/*.js'])
	.pipe(plumber())
	.pipe(babel({presets: ['es2015']}))
	.pipe(concat('stile.min.js'))
	.pipe(uglify())
	.pipe(gulp.dest('dist/js'));

	gulp.src('src/js/**/*.js')
	.pipe(plumber())
	.pipe(babel({presets: ['es2015']}))
	.pipe(concat('stile-full.min.js'))
	.pipe(uglify())
	.pipe(gulp.dest('dist/js'));

	gulp.src('src/js/*/*.js')
	.pipe(plumber())
	.pipe(babel({presets: ['es2015']}))
	.pipe(uglify())
	.pipe(rename({extname: '.min.js'}))
	.pipe(gulp.dest('dist/js'));
});

gulp.task('sass', function () {
	gulp.src(['src/sass/**'], {base: 'src/sass'})
	.pipe(changed('dist/sass'))
	.pipe(plumber())
	.pipe(gulp.dest('dist/sass'));
});

gulp.task('watch', function() {
	gulp.watch('src/js/**/*.js', ['js']);
	gulp.watch('src/sass/**/*.scss', ['sass']);
});

gulp.task('build', ['js', 'sass']);
gulp.task('default', ['js', 'sass', 'watch']);


// -----------------------------------------------------------------------------

gulp.task('sample', function () {
	gulp.src('sample/style.scss')
	.pipe(plumber())
    .pipe(sourcemaps.init())
	.pipe(sass())
	.pipe(cleanCSS())
	.pipe(rename({extname: '.min.css'}))
	.pipe(sourcemaps.write('.'))
	.pipe(gulp.dest('sample'));
});
