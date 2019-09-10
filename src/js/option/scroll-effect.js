/**
 *
 * Scroll Effect
 *
 * @author Takuto Yanagida @ Space-Time Inc.
 * @version 2019-09-10
 *
 */


window.ST = window['ST'] || {};


(function (NS) {

	const ST_SCROLL_EFFECT = 'scroll-effect';
	const ST_STATE_VISIBLE = 'visible';
	const OFFSET           = 100;


	NS.addInit(5, initialize);


	// -------------------------------------------------------------------------


	function initialize() {
		const tars = document.querySelectorAll('*[data-stile ~= ' + ST_SCROLL_EFFECT + ']');

		NS.onIntersect(onIntersect, true, { targets: tars, marginLeft: '10000', marginRight: '10000', marginBottom: OFFSET, threshold: 0 });
		function onIntersect(vs) {
			for (let i = 0; i < tars.length; i += 1) {
				const tar = tars[i];
				if (vs[i]) NS.addStile(tar, ST_STATE_VISIBLE);
			}
		}

		NS.onBeforePrint(onPrint);
		function onPrint() {
			for (let i = 0; i < tars.length; i += 1) {
				NS.addStile(tars[i], ST_STATE_VISIBLE);
			}
		}
	}

})(window.ST);
