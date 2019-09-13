/**
 *
 * Base Functions (JS)
 *
 * @author Takuto Yanagida @ Space-Time Inc.
 * @version 2019-09-13
 *
 */


window.ST = window['ST'] || {};


(function (NS) {

	const initLevels = [[], [], [], [], [], []];

	document.addEventListener('DOMContentLoaded', () => {
		for (let j = 0; j < initLevels.length; j += 1) {
			const inits = initLevels[j];
			for (let i = 0; i < inits.length; i += 1) inits[i]();
		}
	});

	NS.addInit = (level, fn) => { initLevels[level].push(fn); }


	// 0: query
	// 1: inline, link, anchor-offset, segmenter
	// 2: lazy-image-loading, image-box, kerning
	// 3: block, list, table-neat-wrap
	// 4: alignment, container, pseudo-tab-page, tab-page, table-fixed-header
	// 5: anchor-scroll, anchor-offset (scroll to hash), scroll-effect


	// -------------------------------------------------------------------------


	NS.addStile = (elm, style) => {
		if (elm.dataset.stile) {
			const ssl = ' ' + elm.dataset.stile + ' ';
			const sbb = ' ' + style + ' ';
			if (ssl.indexOf(sbb) !== -1) return;
			elm.dataset.stile = elm.dataset.stile + ' ' + style;
		} else {
			elm.dataset.stile = style;
		}
		// eslint-disable-next-line no-self-assign
		elm.className = elm.className;  // Hack for IE11
		if (!elm.className) elm.removeAttribute('class');
	};

	NS.containStile = (elm, style) => {
		if (!elm.dataset.stile) return false;
		const ssl = ' ' + elm.dataset.stile + ' ';
		const sbb = ' ' + style + ' ';
		return (ssl.indexOf(sbb) !== -1);
	};

	NS.removeStile = (elm, style) => {
		if (!elm.dataset.stile) return;
		const ssl = ' ' + elm.dataset.stile + ' ';
		const sbb = ' ' + style + ' ';
		elm.dataset.stile = (ssl.replace(sbb, ' ')).trim();
		// eslint-disable-next-line no-self-assign
		elm.className = elm.className;  // Hack for IE11
		if (!elm.className) elm.removeAttribute('class');
	};


	// -------------------------------------------------------------------------


	const resizeListeners = [];
	const scrollListeners = [];

	document.addEventListener('DOMContentLoaded', () => {
		const opt = (NS.BROWSER === 'ie11') ? false : { passive: true };
		window.addEventListener('resize', () => { for (let i = 0; i < resizeListeners.length; i += 1) resizeListeners[i](); }, opt);
		window.addEventListener('scroll', () => { for (let i = 0; i < scrollListeners.length; i += 1) scrollListeners[i](); }, opt);
	});

	NS.onResize = (fn, doFirst = false) => {
		if (doFirst) fn();
		resizeListeners.push(NS.throttle(fn));
	};

	NS.onScroll = (fn, doFirst = false) => {
		if (doFirst) fn();
		scrollListeners.push(NS.throttle(fn));
	};

	NS.throttle = (fn) => {
		let isRunning;
		function run() {
			isRunning = false;
			fn();
		}
		return () => {
			if (isRunning) return;
			isRunning = true;
			requestAnimationFrame(run);
		};
	};

	NS.onBeforePrint = (fn, forceMediaCheck = true) => {
		window.addEventListener('beforeprint', fn, false);
		if (forceMediaCheck || !('onbeforeprint' in window)) {
			if (window.matchMedia) {
				let mediaQueryList = window.matchMedia('print');
				mediaQueryList.addListener((mql) => { if (mql.matches) fn(); });
			}
		}
	};


	// -------------------------------------------------------------------------


	NS.onIntersect = (fn, doFirst = false, opts = {}) => {
		if (opts.targets      === undefined) opts.targets      = [];
		if (opts.marginTop    === undefined) opts.marginTop    = 0;
		if (opts.marginLeft   === undefined) opts.marginLeft   = 0;
		if (opts.marginRight  === undefined) opts.marginRight  = 0;
		if (opts.marginBottom === undefined) opts.marginBottom = 0;
		if (opts.threshold    === undefined) opts.threshold    = 1;
		const ts = [].slice.call(opts.targets);

		if ('IntersectionObserver' in window) {
			observeIntersection(fn, opts, ts);
		} else {
			observeIntersection_compat(fn, opts, ts, doFirst);
		}
	};

	function observeIntersection(fn, os, ts) {
		function init() {
			// for workaround of rootMargin bug on Android Chrome
			const r = (document.body.classList.contains('android') && NS.BROWSER === 'chrome') ? window.devicePixelRatio : 1;
			const rootMargin = (mt * r) + 'px ' + (os.marginRight * r) + 'px ' + (os.marginBottom * r) + 'px ' + (os.marginLeft * r) + 'px';
			const io = new IntersectionObserver((es) => {
				const vs = Array.from(prevVs);
				for (let i = 0; i < es.length; i += 1) vs[ts.indexOf(es[i].target)] = es[i].isIntersecting;
				if (!isMatch(vs, prevVs)) fn(vs);
				prevVs = vs;
			}, { rootMargin: rootMargin, threshold: os.threshold });
			for (let i = 0; i < ts.length; i += 1) io.observe(ts[i]);
			return io;
		}
		let prevVs = Array(ts.length).fill(false);
		let mt = os.marginTop;
		if (mt !== 'OFFSET') {
			init();
			return;
		}
		let io = null;
		let st = null;
		const off = NS.makeOffsetFunction(true);  // Initialize here
		NS.onResize(() => {
			mt = -off();
			if (st) clearTimeout(st);
			st = setTimeout(() => {
				if (io) io.disconnect();
				io = init();
			}, 100);
		}, true);
	}

	function observeIntersection_compat(fn, os, ts, doFirst) {
		let prevVs = [];
		let mt = os.marginTop;
		if (mt === 'OFFSET') {
			const off = NS.makeOffsetFunction(true);  // Initialize here
			NS.onResize(() => { mt = -off(); }, true);
		}
		NS.onScroll(() => {
			const wh = window.innerHeight;
			const vs = [];
			for (let i = 0; i < ts.length; i += 1) {
				const r = ts[i].getBoundingClientRect();
				vs.push((r.top + r.height * os.threshold < wh + os.marginBottom) && (-mt < r.bottom - r.height * os.threshold));
			}
			if (!isMatch(vs, prevVs)) fn(vs);
			prevVs = vs;
		}, doFirst);
	}

	function isMatch(vs0, vs1) {
		if (vs1.length !== vs0.length) return false;
		for (let i = 0; i < vs0.length; i += 1) {
			if (vs0[i] !== vs1[i]) return false;
		}
		return true;
	}


	// -------------------------------------------------------------------------


	const CLS_STICKY_ELM     = 'st-sticky-header';
	const CLS_STICKY_ELM_TOP = 'st-sticky-header-top';

	NS.makeOffsetFunction = (addWpAdminBarHeight = false) => {
		const f = makeOffsetFunction();
		if (addWpAdminBarHeight) return () => (f() + NS.getWpAdminBarHeight());
		return f;
	};

	function makeOffsetFunction() {
		const esFix = document.getElementsByClassName(CLS_STICKY_ELM);
		if (!esFix || esFix.length === 0) return () => 0;
		const eFix = esFix[0];

		const esTop = document.getElementsByClassName(CLS_STICKY_ELM_TOP);
		if (!esTop || esTop.length === 0) {
			return () => (getComputedStyle(eFix).position === 'fixed' ? eFix.offsetHeight : 0);
		}
		return () => {
			if (getComputedStyle(eFix).position === 'fixed') {
				let h = 0;
				for (let i = 0; i < esTop.length; i += 1) h += esTop[i].offsetHeight;
				return h;
			}
			return 0;
		};
	}

	NS.getWpAdminBarHeight = () => {
		const e = document.getElementById('wpadminbar');
		return (e && getComputedStyle(e).position === 'fixed') ? e.offsetHeight : 0;
	};

})(window.ST);
