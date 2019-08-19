/* eslint-disable no-undef */
'use strict';

const gulp = require('gulp');
const $ = require('gulp-load-plugins')({ pattern: ['gulp-*'] });


gulp.task('js-with-option', () => gulp.src(['src/js/basic/*.js', 'src/js/content/*.js', 'src/js/option/**/*.js'])
	.pipe($.plumber())
	.pipe($.sourcemaps.init())
	.pipe($.concat('stile-full.min.js'))
	.pipe($.babel())
	.pipe($.terser())
	.pipe($.sourcemaps.write('.'))
	.pipe(gulp.dest('./dist/js'))
);

gulp.task('js-without-option', () => gulp.src(['src/js/basic/*.js', 'src/js/content/*.js'])
	.pipe($.plumber())
	.pipe($.sourcemaps.init())
	.pipe($.concat('stile.min.js'))
	.pipe($.babel())
	.pipe($.terser())
	.pipe($.sourcemaps.write('.'))
	.pipe(gulp.dest('./dist/js'))
);

gulp.task('js-each', () => gulp.src('src/js/**/*.js')
	.pipe($.plumber())
	.pipe($.sourcemaps.init())
	.pipe($.babel())
	.pipe($.terser())
	.pipe($.rename({ extname: '.min.js' }))
	.pipe($.sourcemaps.write('.'))
	.pipe(gulp.dest('./dist/js'))
);

gulp.task('js', gulp.parallel('js-with-option', 'js-without-option', 'js-each'));

gulp.task('sass', () => gulp.src(['src/sass/**/*.scss'], { base: 'src/sass' })
	.pipe($.plumber())
	.pipe($.changed('./dist/sass'))
	.pipe(gulp.dest('./dist/sass'))
);

gulp.task('watch', () => {
	gulp.watch('src/js/**/*.js', gulp.series('js'));
	gulp.watch('src/sass/**/*.scss', gulp.series('sass'));
});

gulp.task('build', gulp.parallel('js', 'sass'));

gulp.task('default', gulp.series('build', 'watch'));


// -----------------------------------------------------------------------------


gulp.task('docs-sass', gulp.series('sass', () => gulp.src(['docs/style.scss', 'docs/reset.scss'])
	.pipe($.plumber({
		errorHandler: function (err) {
			console.log(err.messageFormatted);
			this.emit('end');
		}
	}))
	.pipe($.sourcemaps.init())
	.pipe($.sass({ outputStyle: 'compressed' }))
	.pipe($.autoprefixer({ remove: false }))
	.pipe($.rename({ extname: '.min.css' }))
	.pipe($.sourcemaps.write('.'))
	.pipe(gulp.dest('./docs/css')))
);

gulp.task('docs-js', gulp.series('js-with-option', () => gulp.src(['dist/js/stile-full.min.js', 'dist/js/stile-full.min.js.map'])
	.pipe($.plumber())
	.pipe(gulp.dest('./docs')))
);

gulp.task('docs-watch', () => {
	gulp.watch('src/js/**/*.js',     gulp.series('docs-js'));
	gulp.watch('src/sass/**/*.scss', gulp.series('docs-sass'));
	gulp.watch('docs/*.scss',        gulp.series('docs-sass'));
});

gulp.task('docs-build', gulp.parallel('docs-js', 'docs-sass'));

gulp.task('docs-default', gulp.series('docs-build', 'docs-watch'));

gulp.task('docs', gulp.parallel('default', 'docs-default'));
