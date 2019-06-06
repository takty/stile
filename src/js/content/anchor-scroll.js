/**
 *
 * Anchor Scroll
 *
 * @author Takuto Yanagida @ Space-Time Inc.
 * @version 2019-06-06
 *
 */


window.ST = window['ST'] || {};


ST.addInitializer(4, function () {

	const CLS_STICKY_ELM     = 'st-sticky-header';
	const CLS_STICKY_ELM_TOP = 'st-sticky-header-top';

	const CLS_LINK_TARGET = 'stile-link-target';
	const SELECTOR_TARGET = '.stile *[id]:not([class])';

	const SCROLL_DURATION = 400;
	const ST_NO_ANCHOR_SCROLL = 'no-anchor-scroll';
	const ST_ANCHOR_SCROLL_FAST = 'anchor-scroll-fast';

	let ADDITIONAL_OFFSET = 16;
	if (typeof ST.ANCHOR_SCROLL_ADDITIONAL_OFFSET !== 'undefined') ADDITIONAL_OFFSET = ST.ANCHOR_SCROLL_ADDITIONAL_OFFSET;

	const as = document.getElementsByTagName('a');
	initializeSmoothScroll(as);


	// -------------------------------------------------------------------------
	// Anchor Offset


	const getAnchorOffset = ST.makeOffsetFunction(CLS_STICKY_ELM, CLS_STICKY_ELM_TOP);
	if (ADDITIONAL_OFFSET + getAnchorOffset() !== 0) {
		const as1 = Array.prototype.slice.call(document.getElementsByClassName(CLS_LINK_TARGET));
		const as2 = Array.prototype.slice.call(document.querySelectorAll(SELECTOR_TARGET));
		const anchorTargets = as1.concat(filterTarget(as2));
		initializeAnchorOffset(anchorTargets);

		if (window.location.hash) hashChanged();
	}
	window.addEventListener('hashchange', hashChanged);

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
			// setTimeout(function () {window.scrollTo(0, ST.elementTopOnWindow(tar))}, 200);
			// setTimeout(function () {window.scrollTo(0, ST.elementTopOnWindow(tar))}, 300);
			setTimeout(function () { window.scrollTo(0, tar.getBoundingClientRect().top + window.pageYOffset); }, 200);
			setTimeout(function () { window.scrollTo(0, tar.getBoundingClientRect().top + window.pageYOffset); }, 300);
		}
	}

	function initializeAnchorOffset(ats) {
		for (let i = 0; i < ats.length; i += 1) {
			const at = ats[i];
			const pat = document.createElement('span');
			pat.style.display = 'inline-block';
			pat.style.position = 'absolute';
			pat.style.zIndex = -9999;
			pat.style.pointerEvents = 'none';
			pat.style.left = 0;
			pat.style.width = '100%';
			pat.id = at.id;
			pat.dataset['stile'] = 'anchor-offset';

			at.style.position = 'relative';
			at.dataset.id = at.id;
			at.id = '';
			at.appendChild(pat);
		}
		ST.onResize(() => { setAnchorOffset(ats); });
		setTimeout(() => { setAnchorOffset(ats); }, 100);
	}

	function setAnchorOffset(ats) {
		const offset = getAnchorOffset();
		const wpabH = ST.getWpAdminBarHeight();
		const off = offset + wpabH + ADDITIONAL_OFFSET;

		for (let i = 0; i < ats.length; i += 1) {
			const at = ats[i];
			const pat = document.getElementById(at.dataset.id);
			const newTop = -off;
			pat.style.top = newTop + 'px';
		}
	}

	// Export
	ST.initializeAnchorOffset = initializeAnchorOffset;


	// -------------------------------------------------------------------------
	// Smooth Scroll


	let isJumping = false;

	function initializeSmoothScroll(as) {
		for (let i = 0; i < as.length; i += 1) {
			const a = as[i];
			if (ST.containStile(a, ST_NO_ANCHOR_SCROLL)) continue;

			const cn = (a.className + '').trim();
			if (cn !== '') continue;

			const href = a.getAttribute('href');
			if (!href) continue;
			if (href[0] !== '#' || href === '#') {
				const pos = href.lastIndexOf('#');
				if (pos === -1) continue;
				const url = href.substr(0, pos);
				const pn = window.location.pathname;
				if (pn.lastIndexOf(url) !== pn.length - url.length) continue;
			}
			a.addEventListener('click', onClickAnchorLink);
		}
		document.addEventListener('wheel', function () { isJumping = false; });
	}

	function onClickAnchorLink(e) {
		let href = e.target.getAttribute('href');
		if (href) {
			const pos = href.lastIndexOf('#');
			if (pos !== -1) href = href.substr(pos);
			jumpToHash(e, href);
		}
	}

	// Export
	ST.onClickAnchorLink = onClickAnchorLink;

	function jumpToHash(e, hash) {
		let tar = false;
		if (hash === '#top' || hash === null || hash === '') {
			tar = document.documentElement;
		} else {
			tar = document.getElementById(hash.substr(1));
		}
		if (!tar) return false;
		e.stopPropagation();
		e.preventDefault();
		const sep = ST.containStile(e.target, ST_ANCHOR_SCROLL_FAST) ? 4 : 1;
		jump(tar, SCROLL_DURATION / sep);
	}

	function jump(tar, duration) {
		const start = window.pageYOffset;
		// let posY = ST.elementTopOnWindow(tar);
		let posY = tar.getBoundingClientRect().top + window.pageYOffset;
		let wh = document.documentElement.offsetHeight;
		let timeStart, timeElapsed;

		isJumping = true;
		requestAnimationFrame(function (time) {timeStart = time; loop(time);});

		function loop(time) {
			if (!isJumping) return;
			if (wh !== document.documentElement.offsetHeight) {  // for lazy image loading
				// posY = ST.elementTopOnWindow(tar);
				posY = tar.getBoundingClientRect().top + window.pageYOffset;
				wh = document.documentElement.offsetHeight;
			}
			timeElapsed = time - timeStart;
			window.scrollTo(0, easing(timeElapsed, start, posY, duration));
			if (timeElapsed < duration) requestAnimationFrame(loop)
			else end();
		}
		function end() {
			// window.scrollTo(0, ST.elementTopOnWindow(tar));
			// setTimeout(function () {window.scrollTo(0, ST.elementTopOnWindow(tar));}, 50);
			window.scrollTo(0, tar.getBoundingClientRect().top + window.pageYOffset);
			setTimeout(function () { window.scrollTo(0, tar.getBoundingClientRect().top + window.pageYOffset); }, 50);
			if (tar !== document.documentElement) setFocus(tar);
			isJumping = false;
		}
		function easing(t, b, c, d)  {
			t /= d / 2;
			if (t < 1) return (c - b) / 2 * t * t + b;
			t--;
			return -(c - b) / 2 * (t * (t - 2) - 1) + b;
		}
	}

	function setFocus(tar) {
		if (!tar) return;
		if (ST.containStile(tar, 'anchor-offset')) {
			tar = tar.parentElement;
		}
		if (!/^(?:a|select|input|button|textarea)$/i.test(tar.tagName)) {
			tar.tabIndex = -1;
		}
		tar.focus();
	}

});
