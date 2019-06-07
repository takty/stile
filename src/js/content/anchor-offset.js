/**
 *
 * Anchor Scroll (JS)
 *
 * @author Takuto Yanagida @ Space-Time Inc.
 * @version 2019-06-07
 *
 */


window.ST = window['ST'] || {};


(function (NS) {

	const CLS_STICKY_ELM        = 'st-sticky-header';
	const CLS_STICKY_ELM_TOP    = 'st-sticky-header-top';

	const CLS_LINK_TARGET       = 'stile-link-target';
	const SEL_TARGET            = '.stile *[id]:not([class])';

	const ST_ANCHOR_OFFSET      = 'anchor-offset';
	let ADDITIONAL_OFFSET       = 16;
	if (NS.ANCHOR_SCROLL_ADDITIONAL_OFFSET !== undefined) ADDITIONAL_OFFSET = NS.ANCHOR_SCROLL_ADDITIONAL_OFFSET;

	NS.addInitializer(2, initializeAnchorOffset);
	// Export the function
	NS.assignAnchorOffset = assignAnchorOffset;

	function scrollTo(tar) {
		window.scrollTo(0, tar.getBoundingClientRect().top + window.pageYOffset);
	}


	// Anchor Offset -----------------------------------------------------------


	const getAnchorOffset = NS.makeOffsetFunction(CLS_STICKY_ELM, CLS_STICKY_ELM_TOP);

	function initializeAnchorOffset() {
		if (ADDITIONAL_OFFSET + getAnchorOffset() !== 0) {
			const as1 = Array.prototype.slice.call(document.getElementsByClassName(CLS_LINK_TARGET));
			const as2 = Array.prototype.slice.call(document.querySelectorAll(SEL_TARGET));
			const anchorTargets = as1.concat(filterTarget(as2));
			assignAnchorOffset(anchorTargets);

			if (window.location.hash) hashChanged();
		}
		window.addEventListener('hashchange', hashChanged);
	}

	function filterTarget(ts) {
		const newTs = [];
		for (let i = 0; i < ts.length; i += 1) {
			const t = ts[i];
			const tn = t.tagName;
			if (tn === 'INPUT' || tn === 'BUTTON' || tn === 'SELECT' || tn === 'TEXTAREA') continue;
			newTs.push(t);
		}
		return newTs;
	}

	function hashChanged() {
		let hash = window.location.hash;
		if (hash[0] === '#') hash = hash.substr(1);
		const tar = document.getElementById(hash);
		if (tar) {
			setTimeout(() => { scrollTo(tar); }, 200);
			setTimeout(() => { scrollTo(tar); }, 300);
		}
	}

	// Exported function
	function assignAnchorOffset(ats) {
		for (let i = 0; i < ats.length; i += 1) {
			const at = ats[i];
			const pat = document.createElement('span');
			pat.id               = at.id;
			pat.dataset['stile'] = ST_ANCHOR_OFFSET;

			at.style.position = 'relative';
			at.dataset.id     = at.id;
			at.id             = '';
			at.appendChild(pat);
		}
		NS.onResize(() => { setAnchorOffset(ats); });
		setTimeout(() => { setAnchorOffset(ats); }, 100);
	}

	function setAnchorOffset(ats) {
		const offset = getAnchorOffset();
		const wpabH = NS.getWpAdminBarHeight();
		const off = offset + wpabH + ADDITIONAL_OFFSET;

		for (let i = 0; i < ats.length; i += 1) {
			const at = ats[i];
			const pat = document.getElementById(at.dataset.id);
			const newTop = -off;
			pat.style.top = newTop + 'px';
		}
	}

})(window.ST);
