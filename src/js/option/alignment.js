/**
 *
 * Alignment Classes (JS)
 *
 * @author Takuto Yanagida @ Space-Time Inc.
 * @version 2018-05-30
 *
 */


let ST = ST || {};


document.addEventListener('DOMContentLoaded', function () {

	const TARGET_SELECTOR = '.stile';
	const WIDTH_MIN = 320;  // px

	if (ST.BROWSER === 'ie11') return;

	const als = document.querySelectorAll(TARGET_SELECTOR + ' .alignleft');
	modifyAlignmentStyle(als, 'alignleft');
	const ars = document.querySelectorAll(TARGET_SELECTOR + ' .alignright');
	modifyAlignmentStyle(ars, 'alignright');


	// -------------------------------------------------------------------------
	// Alignment

	function modifyAlignmentStyle(as, stile) {
		const asw = initTargets(as);
		assignWidths(asw, stile);
		window.addEventListener('resize', function () {
			updateApplicableWidths(asw);
			switchFloat(asw, stile);
		});
		window.addEventListener('scroll', function () {
			assignWidths(asw, stile);  // for Lazy Image Loading
		});
	}

	function initTargets(as) {
		const asw = [];
		for (let i = 0; i < as.length; i += 1) asw.push([as[i], 0]);
		return asw;
	}

	function assignWidths(asw, stile) {
		for (let i = 0; i < asw.length; i += 1) {
			const a = asw[i][0], w = asw[i][1];
			if (10 < w) continue;
			ST.addStile(a, stile);
			const nw = a.getBoundingClientRect().width;
			ST.removeStile(a, stile);
			asw[i][1] = nw;
		}
		return asw;
	}

	function updateApplicableWidths(asw) {
		for (let i = 0; i < asw.length; i += 1) {
			const a = asw[i][0], w = asw[i][1];
			const pw = contentWidth(a.parentElement);
			const nw = a.getBoundingClientRect().width;
			if (nw < pw * 0.9 && w < nw) asw[i][1] = nw;
		}
	}

	function switchFloat(asw, stile) {
		for (let i = 0; i < asw.length; i += 1) {
			const a = asw[i][0], w = asw[i][1];
			const pw = contentWidth(a.parentElement);
			if (pw - w < WIDTH_MIN) {
				ST.removeStile(a, stile);
				ST.addStile(a, 'aligncenter');
			} else {
				ST.removeStile(a, 'aligncenter');
				ST.addStile(a, stile);
			}
		}
	}

	function contentWidth(elm) {
		const style = getComputedStyle(elm);
		const padH = parseFloat(style.paddingLeft) + parseFloat(style.paddingRight);
		return elm.clientWidth - padH;
	}

});
