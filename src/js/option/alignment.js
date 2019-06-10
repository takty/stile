/**
 *
 * Alignment Classes (JS)
 *
 * @author Takuto Yanagida @ Space-Time Inc.
 * @version 2019-06-10
 *
 */


window.ST = window['ST'] || {};


(function (NS) {

	const TARGET_SELECTOR = '.stile';
	const WIDTH_MIN = 240;  // px

	const PERMITTED_CLASSES = ['alignleft', 'aligncenter', 'alignright', 'size-thumbnail', 'size-small', 'size-medium-small', 'size-medium', 'size-medium-large', 'size-medium_large', 'size-large', 'size-full'];

	NS.addInitializer(1, () => {
		let als = document.querySelectorAll(TARGET_SELECTOR + ' .alignleft');
		let ars = document.querySelectorAll(TARGET_SELECTOR + ' .alignright');
		const acs = document.querySelectorAll(TARGET_SELECTOR + ' .aligncenter');
		als = replaceAlignClass(als);
		ars = replaceAlignClass(ars);
		replaceAlignClass(acs);

		if (NS.BROWSER === 'ie11') return;

		setTimeout(() => {
			modifyAlignmentStyle(als, 'alignleft');
			modifyAlignmentStyle(ars, 'alignright');
		}, 0);  // Delay
	});


	// -------------------------------------------------------------------------


	function modifyAlignmentStyle(as, stile) {
		const asw = initTargets(as);
		assignWidths(asw, stile);
		NS.onResize(() => {
			updateApplicableWidths(asw);
			switchFloat(asw, stile);
		});
		NS.onScroll(() => { assignWidths(asw, stile); });  // for Lazy Image Loading
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
			NS.addStile(a, stile);
			const nw = a.getBoundingClientRect().width;
			NS.removeStile(a, stile);
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
				NS.removeStile(a, stile);
				NS.addStile(a, 'aligncenter');
			} else {
				NS.removeStile(a, 'aligncenter');
				NS.addStile(a, stile);
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
		const ret = [];
		for (let i = 0; i < ts.length; i += 1) {
			const c = ts[i];
			const p = c.parentNode;
			let replace = false;
			if (p.tagName === 'A' && isImageLink(p)) {
				if (moveClass(c, p, 'alignleft'))   replace = true;
				if (moveClass(c, p, 'aligncenter')) replace = true;
				if (moveClass(c, p, 'alignright'))  replace = true;
			}
			ret.push(replace ? p : c);
		}
		return ret;
	}

	function moveClass(c, p, cls) {
		if (c.classList.contains(cls)) {
			c.classList.remove(cls);
			p.classList.add(cls);
			return true;
		}
		return false;
	}

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

})(window.ST);
