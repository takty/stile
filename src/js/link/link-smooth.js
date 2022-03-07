/**
 *
 * Link - Smooth Scroll
 *
 * @author Takuto Yanagida
 * @version 2021-12-26
 *
 */


'use strict';

window['NACSS']         = window['NACSS']         || {};
window['NACSS']['link'] = window['NACSS']['link'] || {};


((NS) => {

	// @include __style-class.js

	// @include _smooth.js
	NS.applySmooth = apply;

	NS.smoothScrollToElement = smoothScrollToElement;

	// @include _common.js

})(window['NACSS']['link']);
