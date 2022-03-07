/**
 *
 * Japanese Text
 *
 * @author Takuto Yanagida
 * @version 2021-12-26
 *
 */


'use strict';

window['NACSS']       = window['NACSS']       || {};
window['NACSS']['ja'] = window['NACSS']['ja'] || {};


((NS) => {

	// @include __style-class.js
	{
		// @include _kerning.js
		NS.applyKerning         = apply;
		NS.applyKerningToString = applyToString;
	}
	{
		// @include _segmenter.js
		NS.applySegmenter         = apply;
		NS.applySegmenterToString = applyToString;
	}
	// @include _common.js

})(window['NACSS']['ja']);
