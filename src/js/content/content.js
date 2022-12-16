/**
 *
 * Content
 *
 * @author Takuto Yanagida
 * @version 2021-12-26
 *
 */


'use strict';

window['NACSS']            = window['NACSS']            || {};
window['NACSS']['content'] = window['NACSS']['content'] || {};


((NS) => {

	// @include __style-class.js
	{
		// @include _image-alt.js
		NS.applyImageAlt = apply;
	}
	{
		// @include _figure-caption.js
		NS.applyFigureCaption = apply;
	}
	{
		// @include _iframe-aspect.js
		NS.applyIframeAspect = apply;
	}
	{
		// @include _underline.js
		NS.applyUnderline = apply;
	}

})(window['NACSS']['content']);
