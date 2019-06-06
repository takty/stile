/**
 *
 * Lazy Image Loading
 *
 * @author Takuto Yanagida @ Space-Time Inc.
 * @version 2019-06-06
 *
 */


window.ST = window['ST'] || {};


(function (NS) {

	const TARGET_SELECTOR = '.stile';
	const OFFSET = 100;


	NS.addInitializer(5, () => { initialize(); });


	// -------------------------------------------------------------------------


	function initialize() {
		const imgs      = document.querySelectorAll(TARGET_SELECTOR + ' img');
		const imgsInTbl = document.querySelectorAll(TARGET_SELECTOR + ' table img');

		const winY = window.pageYOffset;
		for (let i = 0; i < imgs.length; i += 1) {
			const img = imgs[i];
			if ([].indexOf.call(imgsInTbl, img) !== -1) continue;
			// if (ST.elementTopOnWindow(img) >= winY + window.innerHeight + OFFSET) hide(img);
			if (img.getBoundingClientRect().top + winY >= winY + window.innerHeight + OFFSET) hide(img);
		}
		NS.onScroll(onScroll);
		onScroll();

		function onScroll() {
			const winY = window.pageYOffset;
			for (let i = 0; i < imgs.length; i += 1) {
				const img = imgs[i];
				if (!img.dataset.src) continue;
				// const imgY = ST.elementTopOnWindow(img);
				const imgY = img.getBoundingClientRect().top + winY;
				if (imgY < winY + window.innerHeight + OFFSET) show(img);
			}
		}

		doBeforePrint(onPrint);
		function onPrint() {
			for (let i = 0; i < imgs.length; i += 1) {
				const img = imgs[i];
				if (!img.dataset.src) continue;
				show(img, true);
			}
		}
	}

	function hide(img) {
		img.dataset['src'] = img.src;
		img.src = 'data:image/gif;base64,R0lGODdhAQABAPAAAP///wAAACwAAAAAAQABAEACAkQBADs=';
		if (img.srcset) {
			img.dataset['srcset'] = img.srcset;
			img.srcset = '';
		}
		img.style.opacity = 0;
		const h = img.getAttribute('height');
		if (h) img.style.minHeight = h + 'px';
	}

	function show(img, immediately = false) {
		if (img.dataset.srcset) {
			img.srcset = img.dataset.srcset;
			img.dataset.srcset = '';
		}
		img.src = img.dataset.src;
		img.dataset.src = '';
		img.style.minHeight = '';
		if (immediately) {
			img.style.opacity = '';
		} else {
			setTimeout(() => {img.style.opacity = '';}, 200);
		}
	}

	function doBeforePrint(func, forceMediaCheck = true) {
		window.addEventListener('beforeprint', func, false);
		if (forceMediaCheck || !('onbeforeprint' in window)) {
			if (window.matchMedia) {
				let mediaQueryList = window.matchMedia('print');
				mediaQueryList.addListener(function (mql) {
					if (mql.matches) func();
				});
			}
		}
	}

})(window.ST);
