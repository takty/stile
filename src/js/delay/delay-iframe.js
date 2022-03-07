/**
 *
 * Delay Loading - Iframe
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

	// @include _iframe.js
	NS.applyIframe = apply;

	NS.isPolyfillNeededForIframe = () => isPolyfillNeeded(HTMLIFrameElement.prototype);

	// @include _common.js

})(window['NACSS']['delay']);
