/**
 *
 * Smooth Scroll
 *
 * @author Takuto Yanagida
 * @version 2021-12-26
 *
 */


const DURATION = 400;

let isScrolling = false;
const anchorWithListener = new Set();

function apply(as, opts = {}) {
	opts = Object.assign({
		duration        : DURATION,
		observedSelector: null,
	}, opts);

	for (const a of as) {
		addListener(a, opts);
	}
	document.addEventListener('wheel', () => { isScrolling = false; });

	if (opts['observedSelector']) {
		const os = document.querySelectorAll(opts['observedSelector']);
		observeAddition(os, o => addListener(o, opts));
	}
}


// -----------------------------------------------------------------------------


function addListener(a, opts) {
	if (!anchorWithListener.has(a)) {
		function onClick(e) { doClick(e, opts); }
		if (a.href === '#' || a.href === '#top' || isUrlAnchor(a.href)) {
			a.addEventListener('click', onClick);
			anchorWithListener.add(a);
		}
	}
}

function doClick(e, opts) {
	if (e.button !== 0 || e.ctrlKey || e.shiftKey || e.altKey || e.metaKey) return;
	const href = e.currentTarget.getAttribute('href');
	const idx  = href.indexOf('#');
	if (idx !== -1) {
		smoothScrollToHash(e, href.substring(idx), opts.duration);
	}
}

function smoothScrollToHash(e, hash, duration = DURATION) {
	const top = (hash === null || hash === '' || hash === '#' || hash === '#top');
	const tar = top ? document.documentElement : document.getElementById(hash.substring(1));
	if (tar && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
		e.stopPropagation();
		e.preventDefault();

		smoothScrollToElement(tar, duration);
		if (hash !== window.location.hash) {
			history.pushState(null, null, (hash === '#top' ? '' : hash));
		}
	}
}


// -----------------------------------------------------------------------------


function smoothScrollToElement(tar, duration = DURATION, focus = true) {
	const start = window.pageYOffset;
	let posY = getScrollPos(tar);
	let wh   = document.documentElement.offsetHeight;

	let timeStart;
	isScrolling = true;
	requestAnimationFrame((time) => { timeStart = time; loop(time); });

	function loop(time) {
		if (!isScrolling) return;
		if (wh !== document.documentElement.offsetHeight) {  // For delay loading
			posY = getScrollPos(tar);
			wh   = document.documentElement.offsetHeight;
		}
		window.scrollTo(0, easing(time - timeStart, start, posY, duration));
		if (time - timeStart < duration) {
			requestAnimationFrame(loop)
		} else {
			window.scrollTo(0, getScrollPos(tar));
			setTimeout(() => window.scrollTo(0, getScrollPos(tar)), 50);
			if (focus && tar && tar !== document.documentElement) {
				tar.focus();
			}
			isScrolling = false;
		}
	}
}

function getScrollPos(tar) {
	const spt = parseInt(getComputedStyle(document.documentElement).scrollPaddingTop);
	return tar.getBoundingClientRect().top + window.pageYOffset - spt;
}

function easing(t, b, c, d) {
	t /= d / 2;
	if (t < 1) return (c - b) / 2 * t * t + b;
	t--;
	return -(c - b) / 2 * (t * (t - 2) - 1) + b;
}
