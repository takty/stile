/**
 *
 * Delay Loading - Image
 *
 * @author Takuto Yanagida
 * @version 2021-12-26
 *
 */


'use strict';

window['NACSS']          = window['NACSS']          || {};
window['NACSS']['delay'] = window['NACSS']['delay'] || {};


((NS) => {

	// @include __style-class.js
	// @include __utility.js

	// @include _image.js
	NS.applyImage = apply;

	NS.isPolyfillNeededForImage = () => isPolyfillNeeded(HTMLImageElement.prototype);

	// @include _common.js

})(window['NACSS']['delay']);
