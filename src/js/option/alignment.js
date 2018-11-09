/**
 *
 * Alignment Classes (JS)
 *
 * @author Takuto Yanagida @ Space-Time Inc.
 * @version 2018-11-09
 *
 */


let ST = ST || {};


document.addEventListener('load', function () {

	const TARGET_SELECTOR = '.stile';
	const WIDTH_MIN = 320;  // px

	const als = document.querySelectorAll(TARGET_SELECTOR + ' .alignleft');
	const ars = document.querySelectorAll(TARGET_SELECTOR + ' .alignright');
	const acs = document.querySelectorAll(TARGET_SELECTOR + ' .aligncenter');
	replaceAlignClass(als);
	replaceAlignClass(ars);
	replaceAlignClass(acs);

	if (ST.BROWSER === 'ie11') return;

	modifyAlignmentStyle(als, 'alignleft');
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
		updateApplicableWidths(asw);
		switchFloat(asw, stile);
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
			const pw = contentWidth(a.parentElement, true);
			if (pw - w < WIDTH_MIN) {
				ST.removeStile(a, stile);
				ST.addStile(a, 'aligncenter');
			} else {
				ST.removeStile(a, 'aligncenter');
				ST.addStile(a, stile);
			}
		}
	}

	function contentWidth(elm, checkDisplay = false) {
		const style = getComputedStyle(elm);
		if (checkDisplay && style.display === 'inline') return contentWidth(elm.parentElement);
		const padH = parseFloat(style.paddingLeft) + parseFloat(style.paddingRight);
		return elm.clientWidth - padH;
	}


	// -------------------------------------------------------------------------

	function replaceAlignClass(ts) {
		for (let i = 0; i < ts.length; i += 1) {
			const c = ts[i];
			const p = c.parentNode;
			if (p.tagName === 'A' && isImageLink(p)) {
				moveClass(c, p, 'alignleft');
				moveClass(c, p, 'aligncenter');
				moveClass(c, p, 'alignright');
			}
		}
	}

	function moveClass(c, p, cls) {
		if (c.classList.contains(cls)) {
			c.classList.remove(cls);
			p.classList.add(cls);
		}
	}

	const PERMITTED_CLASSES = ['alignleft', 'aligncenter', 'alignright', 'size-thumbnail', 'size-small', 'size-medium', 'size-medium_large', 'size-large', 'size-full'];

	function isImageLink(a) {
		if (a.className) {
			const cs = a.className.split(' ');
			for (let i = 0; i < cs.length; i += 1) {
				if (PERMITTED_CLASSES.indexOf(cs[i]) === -1) return false;
			}
		}
		const cs = a.childNodes;
		if (cs.length === 0) return false;
		let success = false;
		for (let i = 0; i < cs.length; i += 1) {
			const tn = cs[i].tagName;
			if (success === false && tn === 'IMG') {
				success = true;
				continue;
			}
			if (tn) return false;
		}
		return success;
	}

});
