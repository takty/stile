/**
 *
 * Base Functions (JS)
 *
 * @author Takuto Yanagida @ Space-Time Inc.
 * @version 2019-06-16
 *
 */


window.ST = window['ST'] || {};


(function (NS) {

	const initLevels = [[], [], [], [], [], [], [], []];

	document.addEventListener('DOMContentLoaded', () => {
		for (let inits of initLevels) {
			for (let i = 0; i < inits.length; i += 1) inits[i]();  // Do not use 'for-of' here for IE
		}
	});

	NS.addInit = (level, fn) => { initLevels[level].push(fn); }


	// 0: query
	// 1: alignment, container
	// 2: anchor-offset, block, inline, link
	// 3: pseudo-tab-page, tab-page
	// 4: anchor-scroll, list, table-neat-wrap
	// 5: lazy-image-loading, table-fixed-header
	// 6: segmenter
	// 7: image-box, kerning


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


	// -------------------------------------------------------------------------


	const CLS_STICKY_ELM     = 'st-sticky-header';
	const CLS_STICKY_ELM_TOP = 'st-sticky-header-top';

	NS.makeOffsetFunction = () => {
		let elmFixed = document.getElementsByClassName(CLS_STICKY_ELM);
		if (elmFixed && elmFixed.length > 0) {
			elmFixed = elmFixed[0];
			const elmTops = document.getElementsByClassName(CLS_STICKY_ELM_TOP);
			if (elmTops && elmTops.length > 0) {
				return () => {
					const pos = getComputedStyle(elmFixed).position;
					if (pos === 'fixed') {
						let height = 0;
						for (let i = 0; i < elmTops.length; i += 1) height += elmTops[i].offsetHeight;
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
