/**
 *
 * Anchor Scroll (JS)
 *
 * @author Takuto Yanagida @ Space-Time Inc.
 * @version 2019-07-31
 *
 */


window.ST = window['ST'] || {};


(function (NS) {

	const OFFSET = (NS.ANCHOR_OFFSET_ADDITIONAL !== undefined) ? NS.ANCHOR_OFFSET_ADDITIONAL : 32;

	const SEL_TARGET       = '.stile *[id]:not([class])';
	const CLS_LINK_TARGET  = 'stile-link-target';
	const ST_ANCHOR_OFFSET = 'anchor-offset';

	let getOffset;
	let anchorOffsetInitialized = false;

	NS.assignAnchorOffset = assignAnchorOffset;  // Export the function
	NS.addInit(1, initializeAnchorOffset);
	NS.addInit(5, scrollToHash);

	function scrollTo(tar) { window.scrollTo(0, tar.getBoundingClientRect().top + window.pageYOffset); }


	// -------------------------------------------------------------------------


	function initializeAnchorOffset() {
		getOffset = NS.makeOffsetFunction(true);  // Initialize here

		if (OFFSET + getOffset() !== 0) {
			const as1 = [].slice.call(document.getElementsByClassName(CLS_LINK_TARGET));
			const as2 = [].slice.call(document.querySelectorAll(SEL_TARGET));
			const anchorTargets = as1.concat(filterTarget(as2));
			assignAnchorOffset(anchorTargets);
			anchorOffsetInitialized = true;

			window.addEventListener('hashchange', hashChanged);
		}
	}

	function filterTarget(ts) {
		const newTs = [];
		for (let i = 0; i < ts.length; i += 1) {
			const t = ts[i];
			if (!/^(?:input|button|select|textarea)$/i.test(t.tagName)) newTs.push(t);
		}
		return newTs;
	}

	function scrollToHash() {
		if (!anchorOffsetInitialized) return;
		if (window.location.hash) hashChanged();
	}

	function hashChanged() {
		let hash = window.location.hash;
		if (hash[0] === '#') hash = hash.substr(1);
		const tar = document.getElementById(hash);
		if (tar) {
			setTimeout(() => { scrollTo(tar); }, 100);
			setTimeout(() => { scrollTo(tar); }, 200);
			setTimeout(() => { scrollTo(tar); }, 300);

			setTimeout(() => {
				let tar = document.getElementById(hash);
				if (NS.containStile(tar, ST_ANCHOR_OFFSET)) tar = tar.parentElement;
				tar.setAttribute('tabindex', -1);
				tar.focus();
			}, 0);
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
		setTimeout(() => { repeatSettingAnchorOffset(ats); }, 100);
	}

	let lastOffset = 0;

	function repeatSettingAnchorOffset(ats) {
		let o = setAnchorOffset(ats);
		if (lastOffset !== o) {
			lastOffset = o;
			setTimeout(() => { repeatSettingAnchorOffset(ats); }, 100);
		}
	}

	function setAnchorOffset(ats) {
		const off = OFFSET + getOffset();

		for (let i = 0; i < ats.length; i += 1) {
			const at = ats[i];
			const pat = document.getElementById(at.dataset.id);
			pat.style.top = -off + 'px';
		}
		return off;
	}

})(window.ST);
