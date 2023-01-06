/**
 * Container - Masonry
 *
 * @author Takuto Yanagida
 * @version 2023-01-05
 */

'use strict';

window['NACSS']              = window['NACSS']              || {};
window['NACSS']['container'] = window['NACSS']['container'] || {};

((NS) => {

	// @include __utility.js

	// @include _masonry.js
	NS.applyMasonry = apply;

})(window['NACSS']['masonry']);
