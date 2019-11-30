/**
 *
 * Anchor Scroll (JS)
 *
 * @author Takuto Yanagida @ Space-Time Inc.
 * @version 2019-11-30
 *
 */


window.ST = window['ST'] || {};


(function (NS) {

	const DURATION      = 400;
	const DURATION_FAST = 100;

	const ST_NO_ANCHOR_SCROLL   = 'no-anchor-scroll';
	const ST_ANCHOR_SCROLL_FAST = 'anchor-scroll-fast';
	const ST_ANCHOR_OFFSET      = 'anchor-offset';

	NS.onClickAnchorLink = onClickAnchorLink;  // Export the function
	NS.jumpToElement     = jumpToElement;      // Export the function
	NS.addInit(5, initialize);

	function scrollTo(tar) { window.scrollTo(0, tar.getBoundingClientRect().top + window.pageYOffset); }


	// -------------------------------------------------------------------------


	let isJumping = false;

	function initialize() {
		const as = document.getElementsByTagName('a');
		const pn = window.location.pathname;
		for (let i = 0; i < as.length; i += 1) {
			const a = as[i];
			if (NS.containStile(a,               ST_NO_ANCHOR_SCROLL)) continue;
			if (NS.containStile(a.parentElement, ST_NO_ANCHOR_SCROLL)) continue;

			const href = a.getAttribute('href');
			if (!href) continue;
			if (href[0] !== '#' || href === '#') {
				const pos = href.lastIndexOf('#');
				if (pos === -1) continue;
				const url = href.substr(0, pos);
				if (url.lastIndexOf(pn) !== url.length - pn.length) continue;
			}
			a.addEventListener('click', onClickAnchorLink);
		}
		document.addEventListener('wheel', () => { isJumping = false; });
	}

	// Exported function
	function onClickAnchorLink(e) {
		let href = e.currentTarget.getAttribute('href');
		if (href) {
			const pos = href.lastIndexOf('#');
			if (pos !== -1) href = href.substr(pos);
			jumpToHash(e, href);
		}
	}

	function jumpToHash(e, hash) {
		let tar = false;
		if (hash === '#top' || hash === null || hash === '') {
			tar = document.documentElement;
		} else {
			tar = document.getElementById(hash.substr(1));
		}
		if (!tar) return;
		e.stopPropagation();
		e.preventDefault();
		const dur = NS.containStile(e.currentTarget, ST_ANCHOR_SCROLL_FAST) ? DURATION_FAST : DURATION;
		jumpToElement(tar, dur);

		pushHistory(hash);
	}

	function jumpToElement(tar, duration, focus = true) {
		const start = window.pageYOffset;
		let posY = tar.getBoundingClientRect().top + window.pageYOffset;
		let wh = document.documentElement.offsetHeight;
		let timeStart, timeElapsed;

		isJumping = true;
		requestAnimationFrame((time) => { timeStart = time; loop(time); });

		function loop(time) {
			if (!isJumping) return;
			if (wh !== document.documentElement.offsetHeight) {  // for lazy image loading
				posY = tar.getBoundingClientRect().top + window.pageYOffset;
				wh = document.documentElement.offsetHeight;
			}
			timeElapsed = time - timeStart;
			window.scrollTo(0, easing(timeElapsed, start, posY, duration));
			if (timeElapsed < duration) requestAnimationFrame(loop)
			else end();
		}
		function end() {
			scrollTo(tar);
			setTimeout(() => { scrollTo(tar); }, 50);
			if (focus && tar !== document.documentElement) setFocus(tar);
			isJumping = false;
		}
		function easing(t, b, c, d) {
			t /= d / 2;
			if (t < 1) return (c - b) / 2 * t * t + b;
			t--;
			return -(c - b) / 2 * (t * (t - 2) - 1) + b;
		}
	}

	function setFocus(tar) {
		if (!tar) return;
		if (NS.containStile(tar, ST_ANCHOR_OFFSET)) tar = tar.parentElement;
		if (!/^(?:a|select|input|button|textarea)$/i.test(tar.tagName)) {
			tar.tabIndex = -1;
		}
		tar.focus();
	}

	function pushHistory(hash) {
		if (NS.BROWSER === 'ie11') {
			// eslint-disable-next-line func-style
			const hashChanged = () => {
				// eslint-disable-next-line no-self-assign
				window.location = window.location;
				window.removeEventListener('hashchange', hashChanged);
			}
			window.addEventListener('hashchange', hashChanged);
		}
		history.pushState(null, null, (hash === '#top' ? '' : hash));
	}

})(window.ST);
