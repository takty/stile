/**
 *
 * Classes for Alignments (JS)
 *
 * @author Takuto Yanagida @ Space-Time Inc.
 * @version 2018-05-16
 *
 */


document.addEventListener('DOMContentLoaded', function () {

	const TARGET_SELECTOR = '.stile';
	const WIDTH_MIN = 320;  // px

	if (window.navigator.userAgent.toLowerCase().indexOf('trident/7') !== -1) return;

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
			addDataStile(a, stile);
			const nw = a.getBoundingClientRect().width;
			removeDataStile(a, stile);
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
				removeDataStile(a, stile);
				addDataStile(a, 'aligncenter');
			} else {
				removeDataStile(a, 'aligncenter');
				addDataStile(a, stile);
			}
		}
	}

	function contentWidth(elm) {
		const style = getComputedStyle(elm);
		const padH = parseFloat(style.paddingLeft) + parseFloat(style.paddingRight);
		return elm.clientWidth - padH;
	}

	function addDataStile(elm, style) {
		if (elm.dataset.stile) {
			const ssl = ' ' + elm.dataset.stile + ' ';
			const sbb = ' ' + style + ' ';
			if (ssl.indexOf(sbb) !== -1) return;
			elm.dataset.stile = elm.dataset.stile + ' ' + style;
		} else {
			elm.dataset.stile = style;
		}
	}

	function removeDataStile(elm, style) {
		if (!elm.dataset.stile) return;
		const ssl = ' ' + elm.dataset.stile + ' ';
		const sbb = ' ' + style + ' ';
		elm.dataset.stile = (ssl.replace(sbb, ' ')).trim();
	}

});
