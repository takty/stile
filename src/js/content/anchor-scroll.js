/**
 *
 * Anchor Scroll
 *
 * @author Takuto Yanagida @ Space-Time Inc.
 * @version 2018-05-24
 *
 */


let ST = ST || {};


document.addEventListener('DOMContentLoaded', function () {

	const CLS_STICKY_ELM     = 'st-sticky-header';
	const CLS_STICKY_ELM_TOP = 'st-sticky-header-top';

	const CLS_LINK_TARGET = 'stile-link-target';
	const SELECTOR_TARGET = '.stile *[id]:not([class])';

	let ADDITIONAL_OFFSET = 16;
	if (typeof ST.ANCHOR_SCROLL_ADDITIONAL_OFFSET !== 'undefined') ADDITIONAL_OFFSET = ST.ANCHOR_SCROLL_ADDITIONAL_OFFSET;


	// -------------------------------------------------------------------------
	// Anchor Offset

	const getAnchorOffset = ST.makeOffsetFunction(CLS_STICKY_ELM, CLS_STICKY_ELM_TOP);
	if (getAnchorOffset() !== 0) {
		const as1 = Array.prototype.slice.call(document.getElementsByClassName(CLS_LINK_TARGET));
		const as2 = Array.prototype.slice.call(document.querySelectorAll(SELECTOR_TARGET));
		const anchorTargets = as1.concat(filterTarget(as2));

		initTargetToStyle(anchorTargets);
		window.addEventListener('resize', function () {setAnchorOffset(anchorTargets);});
		setTimeout(function () {setAnchorOffset(anchorTargets);}, 100);
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
			setTimeout(function () {window.scrollTo(0, ST.elementTopOnWindow(tar, true))}, 200);
			setTimeout(function () {window.scrollTo(0, ST.elementTopOnWindow(tar, true))}, 300);
		}
	}

	function initTargetToStyle(ats) {
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

			at.style.position = 'relative';
			at.dataset.id = at.id;
			at.id = '';
			at.appendChild(pat);
		}
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


	// -------------------------------------------------------------------------
	// Smooth Scroll

	const as = document.getElementsByTagName('a');

	for (let i = 0; i < as.length; i += 1) {
		const cn = (as[i].className + '').trim();
		if (cn !== '') continue;

		const href = as[i].getAttribute('href');
		if (!href) continue;
		if (href[0] !== '#' || href === '#') {
			const pos = href.lastIndexOf('#');
			if (pos === -1) continue;
			const url = href.substr(0, pos);
			const pn = window.location.pathname;
			if (pn.lastIndexOf(url) !== pn.length - url.length) continue;

			as[i].addEventListener('click', function (e) {
				let href= e.target.getAttribute('href');
				if (href) {
					const pos = href.lastIndexOf('#');
					href = href.substr(pos);
					jumpToHash(e, href);
				}
			});
		} else {
			as[i].addEventListener('click', function (e) {
				const href = e.target.getAttribute('href');
				jumpToHash(e, href);
			});
		}
	}

	let isJumping;
	document.addEventListener('wheel', function () { isJumping = false; });

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
		jump(tar, 800);
	}

	function jump(tar, duration) {
		const start = window.pageYOffset;
		let posY = ST.elementTopOnWindow(tar, true);
		let wh = document.documentElement.offsetHeight;
		let timeStart, timeElapsed;

		isJumping = true;
		requestAnimationFrame(function (time) {timeStart = time; loop(time);});

		function loop(time) {
			if (!isJumping) return;
			if (wh !== document.documentElement.offsetHeight) {  // for lazy image loading
				posY = ST.elementTopOnWindow(tar, true);
				wh = document.documentElement.offsetHeight;
			}
			timeElapsed = time - timeStart;
			window.scrollTo(0, easing(timeElapsed, start, posY, duration));
			if (timeElapsed < duration) requestAnimationFrame(loop)
			else end();
		}
		function end() {
			window.scrollTo(0, ST.elementTopOnWindow(tar, true));
			setTimeout(function () {window.scrollTo(0, ST.elementTopOnWindow(tar, true));}, 50);
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


	// -------------------------------------------------------------------------
	// Utilities

	function setFocus(tar) {
		if (!tar) return;
		if (!/^(?:a|select|input|button|textarea)$/i.test(tar.tagName)) {
			tar.tabIndex = -1;
		}
		tar.focus();
	}

});
