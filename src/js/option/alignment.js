/**
 *
 * Alignment Classes (JS)
 *
 * @author Takuto Yanagida @ Space-Time Inc.
 * @version 2019-07-28
 *
 */


window.ST = window['ST'] || {};


(function (NS) {

	const SEL_TARGET = '.stile';
	const WIDTH_MIN = 240;  // px

	const CLS_AL = 'alignleft';
	const CLS_AR = 'alignright';
	const CLS_AC = 'aligncenter';

	NS.addInit(4, () => {
		let als = document.querySelectorAll(SEL_TARGET + ' .' + CLS_AL);
		let ars = document.querySelectorAll(SEL_TARGET + ' .' + CLS_AR);
		const acs = document.querySelectorAll(SEL_TARGET + ' .' + CLS_AC);

		addOnlyChildElementClass(als);
		addOnlyChildElementClass(ars);
		addOnlyChildElementClass(acs);

		als = replaceAlignClass(als);
		ars = replaceAlignClass(ars);
		replaceAlignClass(acs);

		if (NS.BROWSER === 'ie11') return;

		setTimeout(() => {
			modifyAlignmentStyle(als, CLS_AL);
			modifyAlignmentStyle(ars, CLS_AR);
		}, 0);  // Delay
	});


	// -------------------------------------------------------------------------


	function addOnlyChildElementClass(as) {
		for (let i = 0; i < as.length; i += 1) {
			const a = as[i];
			const cs = a.parentElement.childNodes;
			let isOnlyChildElement = true;
			for (let j = 0; j < cs.length; j += 1) {
				const c = cs[j];
				if (c.nodeType === 3 /*TEXT_NODE*/ && c.textContent.trim() !== '') {
					isOnlyChildElement = false;
					break;
				} else if (c.nodeType === 1 /*ELEMENT_NODE*/ && c !== a) {
					isOnlyChildElement = false;
					break;
				}
			}
			if (isOnlyChildElement) NS.addStile(a, 'only-child-element');
		}
	}


	// -------------------------------------------------------------------------


	function modifyAlignmentStyle(as, stile) {
		const asw = initTargets(as);
		NS.onScroll(() => { assignWidths(asw, stile); }, true);  // for Lazy Image Loading
		NS.onResize(() => {
			updateApplicableWidths(asw);
			switchFloat(asw, stile);
		}, true);
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
			asw[i][1] = a.getBoundingClientRect().width;
			NS.removeStile(a, stile);
		}
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
				NS.addStile(a, CLS_AC);
			} else {
				NS.removeStile(a, CLS_AC);
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
			if (p.tagName === 'A' && NS.isImageLink(p)) {
				if (moveClass(c, p, CLS_AL)) replace = true;
				if (moveClass(c, p, CLS_AC)) replace = true;
				if (moveClass(c, p, CLS_AR)) replace = true;
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

})(window.ST);
