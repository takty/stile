/**
 *
 * Base Functions (JS)
 *
 * @author Takuto Yanagida @ Space-Time Inc.
 * @version 2019-06-06
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

	NS.addInitializer = (level, fn) => { initLevels[level].push(fn); }


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
		// eslint-disable-next-line func-style
		const run = () => {
			isRunning = false;
			fn.apply(that, args);
		};
		return (...origArgs) => {
			that = this;
			args = origArgs;
			if (isRunning) return;
			isRunning = true;
			requestAnimationFrame(run);
		};
	};


	// -------------------------------------------------------------------------


	NS.makeOffsetFunction = (fixedElementClass, fixedTopClass) => {
		let elmFixed = document.getElementsByClassName(fixedElementClass);
		if (elmFixed && elmFixed.length > 0) {
			elmFixed = elmFixed[0];
			const elmTops = document.getElementsByClassName(fixedTopClass);
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
