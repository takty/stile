/**
 *
 * Content Style - Image (JS)
 *
 * @author Takuto Yanagida @ Space-Time Inc.
 * @version 2018-04-03
 *
 */


document.addEventListener('DOMContentLoaded', function () {

	const TARGET_SELECTOR = '.stile';

	initializeLazyImageLoading();
	modifyFigureStyle();


	// -------------------------------------------------------------------------
	// Figure Styles

	function modifyFigureStyle() {
		const figs = document.querySelectorAll(TARGET_SELECTOR + ' figure');
		for (let i = 0; i < figs.length; i += 1) {
			figs[i].style.width = '';
		}
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
			if (elementTopOnWindow(img) >= winY + window.innerHeight + OFFSET) hide(img);
		}
		window.addEventListener('scroll', onScroll);
		onScroll();

		function onScroll() {
			const winY = window.scrollY | window.pageYOffset;
			for (let i = 0; i < imgs.length; i += 1) {
				const img = imgs[i];
				if (!img.dataset.src) continue;
				const imgY = elementTopOnWindow(img);
				if (imgY < winY + window.innerHeight + OFFSET) show(img);
			}
		}

		doBeforePrint(onPrint);
		function onPrint() {
			for (let i = 0; i < imgs.length; i += 1) {
				const img = imgs[i];
				if (!img.dataset.src) continue;
				show(img);
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

	function show(img) {
		if (img.dataset.srcset) {
			img.srcset = img.dataset.srcset;
			img.dataset.srcset = '';
		}
		img.src = img.dataset.src;
		img.dataset.src = '';
		img.style.minHeight = '';
		setTimeout(function () {img.style.opacity = '';}, 200);
	}

	function elementTopOnWindow(elm) {
		let top = 0;
		while (elm) {
			top += elm.offsetTop;
			elm = elm.offsetParent;
		}
		return top;
	}

	function doBeforePrint(func, forceMediaCheck = true) {
		window.addEventListener('beforeprint', func, false);
		if (forceMediaCheck || !('onbeforeprint' in window)) {
			let printMedia;
			if (window.matchMedia && (printMedia = matchMedia('print')) && printMedia.addListener) {
				printMedia.addListener(function () {if (printMedia.matches) func();});
			}
		}
	}

});
