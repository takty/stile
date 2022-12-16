/**
 *
 * Link - Anchor Type
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

	// @include _type.js
	NS.applyType      = apply;
	NS.applyTypeByUrl = applyByUrl;

	NS.isImageLink = isImageLink;

	// @include _common.js

})(window['NACSS']['link']);
