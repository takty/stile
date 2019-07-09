/**
 *
 * Base Functions (JS)
 *
 * @author Takuto Yanagida @ Space-Time Inc.
 * @version 2019-07-09
 *
 */


window.ST = window['ST'] || {};


(function (NS) {

	const initLevels = [[], [], [], [], [], []];

	document.addEventListener('DOMContentLoaded', () => {
		for (let inits of initLevels) {
			for (let i = 0; i < inits.length; i += 1) inits[i]();  // Do not use 'for-of' here for IE
		}
	});

	NS.addInit = (level, fn) => { initLevels[level].push(fn); }


	// 0: query
	// 1: inline, link, anchor-offset, segmenter
	// 2: lazy-image-loading, image-box, kerning
	// 3: block, list, table-neat-wrap
	// 4: alignment, container, pseudo-tab-page, tab-page, table-fixed-header
	// 5: anchor-scroll


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
		window.addEventListener('resize', () => { for (let l of resizeListeners) l(); });
		window.addEventListener('scroll', () => { for (let l of scrollListeners) l(); });
	});

	NS.onResize = (fn) => { resizeListeners.push(NS.throttle(fn)); };

	NS.onScroll = (fn) => { scrollListeners.push(NS.throttle(fn)); };

	NS.throttle = (fn) => {
		let isRunning, that, args;
		function run() {
			isRunning = false;
			fn.apply(that, args);
		}
		return (...origArgs) => {
			that = this;
			args = origArgs;
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


	const CLS_STICKY_ELM     = 'st-sticky-header';
	const CLS_STICKY_ELM_TOP = 'st-sticky-header-top';

	NS.makeOffsetFunction = () => {
		const elmsFixed = document.getElementsByClassName(CLS_STICKY_ELM);
		if (elmsFixed && elmsFixed.length > 0) {
			const elmFixed = elmsFixed[0];
			const elmsTop = document.getElementsByClassName(CLS_STICKY_ELM_TOP);
			if (elmsTop && elmsTop.length > 0) {
				return () => {
					const pos = getComputedStyle(elmFixed).position;
					if (pos === 'fixed') {
						let height = 0;
						for (let i = 0; i < elmsTop.length; i += 1) height += elmsTop[i].offsetHeight;
						return height;
					}
					return 0;
				};
			}
			return () => {
				const pos = getComputedStyle(elmFixed).position;
				return pos === 'fixed' ? elmFixed.offsetHeight : 0;
			};
		}
		return () => 0;
	};

	NS.getWpAdminBarHeight = () => {
		const wpab = document.getElementById('wpadminbar');
		return (wpab && getComputedStyle(wpab).position === 'fixed') ? wpab.offsetHeight : 0;
	};

})(window.ST);
