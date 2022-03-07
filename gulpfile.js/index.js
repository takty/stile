/**
 *
 * Gulpfile
 *
 * @author Takuto Yanagida
 * @version 2022-03-07
 *
 */

/* eslint-disable no-undef */

'use strict';

const SUB_REPS = [
	'align',
	'container',
	'content',
	'delay',
	'font',
	'form',
	'ja',
	'link',
	'list',
	'reset',
	'scroll',
	'tab',
	'table',
	'viewer',
	'utility',
];

const gulp = require('gulp');

const { makeCopyTask }       = require('./task-copy');
const { makeSassTask }       = require('./task-sass');
const { getNodeModulesPath } = require('./node-modules-path');

const NMP = getNodeModulesPath('gulp');


// -----------------------------------------------------------------------------


const sass_s = SUB_REPS.map(e => makeCopyTask(`${NMP}/nacss-${e}/src/sass/*`, `./src/sass/${e}/`));
const js_s   = SUB_REPS.map(e => makeCopyTask(`${NMP}/nacss-${e}/src/js/*`, `./src/js/${e}/`));

exports.update = gulp.parallel(...sass_s, ...js_s);

const copy = makeCopyTask('src/**/*', './dist/');
const sass = makeSassTask('src/sass/reset/*.scss', './dist/css', './src/sass/reset');

exports.default = gulp.parallel(copy, sass);
