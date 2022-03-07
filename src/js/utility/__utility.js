/**
 *
 * Utilities
 *
 * @author Takuto Yanagida
 * @version 2021-12-06
 *
 */


function getScrollOffset() {
	const s   = getComputedStyle(document.documentElement);
	const val = parseInt(s.scrollPaddingTop);
	return Number.isNaN(val) ? 0 : val;
}


// -----------------------------------------------------------------------------


function throttle(fn) {
	let isRunning;
	return (...args) => {
		if (isRunning) return;
		isRunning = true;
		requestAnimationFrame(() => {
			isRunning = false;
			fn(...args);
		});
	};
}

const resizeListeners = [];

function onResize(fn, doFirst = false) {
	if (doFirst) fn();
	resizeListeners.push(throttle(fn));
}

document.addEventListener('DOMContentLoaded', () => {
	window.addEventListener('resize', () => {
		for (const l of resizeListeners) l();
	}, { passive: true });
});


// -----------------------------------------------------------------------------


function onIntersect(fn, targets, threshold = 0, rootMargin ='* 0px 0px 0px') {
	const vs = Array(targets.length).fill(false);
	const tm = new Map();
	targets.forEach((t, i) => tm.set(t, i));

	function init() {
		const io = new IntersectionObserver((es) => {
			for (const e of es) vs[tm.get(e.target)] = e.isIntersecting;
			fn(vs);
		}, { rootMargin: rootMargin.replace('*', `${mt}px`), threshold });
		for (const t of targets) io.observe(t);
		return io;
	}
	let mt = 0;
	let io = null;
	let st = null;
	onResize(() => {
		mt = -getScrollOffset();
		if (st) clearTimeout(st);
		st = setTimeout(() => {
			if (io) io.disconnect();
			io = init();
		}, 100);
	}, true);
}
