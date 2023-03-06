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

import { makeCopyTask } from './gulp/task-copy.mjs';

export const update = async done => {
	const { pkgDir }       = await import('./gulp/common.mjs');
	const { makeSassTask } = await import('./gulp/task-sass.mjs');
	SUB_REPS.map(e => makeCopyTask(`${pkgDir(`nacss-${e}`)}/src/sass/*`, `./src/sass/${e}/`)());
	SUB_REPS.map(e => makeCopyTask(`${pkgDir(`nacss-${e}`)}/src/js/*`, `./src/js/${e}/`)());
	makeSassTask('src/sass/reset/*.scss', './src/css', './src/sass/reset')();
	done();
};
export default gulp.parallel(makeCopyTask('src/**/*', './dist/'));
