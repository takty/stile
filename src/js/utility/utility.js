/**
 * Utility
 *
 * @author Takuto Yanagida
 * @version 2023-02-01
 */

'use strict';

window['NACSS']            = window['NACSS'] || {};
window['NACSS']['utility'] = window['NACSS']['utility'] || {};

(NS => {

	// @include __utility.js
	{
		// @include _query.js
		NS['BROWSER'] = getBrowser();
		NS['DEVICE']  = getDevice();

		onResize(() => {
			[NS['BP_WIDTH'], NS['BP_HEIGHT']] = getBreakPointSize();
		}, true);
	}

	(NS => {

		// @include __style-class.js
		{
			// @include _blank.js
			NS.applyBlank = apply;
		}
		{
			// @include _dimension.js
			NS.applyDimension = apply;
		}

	})(NS['utility']);

})(window['NACSS']);
