/**
 *
 * Utility
 *
 * @author Takuto Yanagida
 * @version 2021-12-26
 *
 */


'use strict';

window['NACSS'] = window['NACSS'] || {};


((NS) => {

	// @include __utility.js
	{
		// @include _query.js
		NS['BROWSER'] = getBrowser();
		NS['DEVICE']  = getDevice();

		onResize(() => {
			[NS['BP_WIDTH'], NS['BP_HEIGHT']] = getBreakPointSize();
		}, true);
	}

})(window['NACSS']);
