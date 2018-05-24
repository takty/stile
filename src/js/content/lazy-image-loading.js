/**
 *
 * Lazy Image Loading
 *
 * @author Takuto Yanagida @ Space-Time Inc.
 * @version 2018-05-24
 *
 */


let ST = ST || {};


document.addEventListener('DOMContentLoaded', function () {

	const TARGET_SELECTOR = '.stile';

	if (window.navigator.userAgent.indexOf('Firefox') === -1) {
		initializeLazyImageLoading();
	}


	// -------------------------------------------------------------------------
	// Lazy Image Loading

	function initializeLazyImageLoading() {
		const OFFSET = 100;
		const imgs = document.querySelectorAll(TARGET_SELECTOR + ' img');
		const imgsInTbl = document.querySelectorAll(TARGET_SELECTOR + ' table img');

		const winY = window.scrollY | window.pageYOffset;
		for (let i = 0; i < imgs.length; i += 1) {
			const img = imgs[i];
			if ([].indexOf.call(imgsInTbl, img) !== -1) continue;
			if (ST.elementTopOnWindow(img) >= winY + window.innerHeight + OFFSET) hide(img);
		}
		window.addEventListener('scroll', onScroll);
		onScroll();

		function onScroll() {
			const winY = window.scrollY | window.pageYOffset;
			for (let i = 0; i < imgs.length; i += 1) {
				const img = imgs[i];
				if (!img.dataset.src) continue;
				const imgY = ST.elementTopOnWindow(img);
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
			setTimeout(function () {img.style.opacity = '';}, 200);
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

});
