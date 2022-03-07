/**
 *
 * Get node_modules path
 *
 * @author Takuto Yanagida
 * @version 2021-12-23
 *
 */

'use strict';

const path = require('path');

function getNodeModulesPath(moduleName) {
	const nmp = require.resolve(moduleName);
	const pwd = nmp.split(path.sep);
	const idx = pwd.findIndex(e => 'node_modules' === e);
	return pwd.slice(0, idx + 1).join(path.sep);
}

exports.getNodeModulesPath = getNodeModulesPath;
