/**
 * Gulpfile
 *
 * @author Takuto Yanagida
 * @version 2023-03-06
 */

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

import gulp from 'gulp';

import { pkgDir } from './gulp/common.mjs';
import { makeSassTask } from './gulp/task-sass.mjs';
import { makeCopyTask } from './gulp/task-copy.mjs';

const sass_s = SUB_REPS.map(e => makeCopyTask(`${pkgDir(`nacss-${e}`)}/src/sass/*`, `./src/sass/${e}/`));
const js_s   = SUB_REPS.map(e => makeCopyTask(`${pkgDir(`nacss-${e}`)}/src/js/*`, `./src/js/${e}/`));

const copy = makeCopyTask('src/**/*', './dist/');
const sass = makeSassTask('src/sass/reset/*.scss', './src/css', './src/sass/reset');

export const update = gulp.parallel(...sass_s, ...js_s, sass);
export default gulp.parallel(copy);
