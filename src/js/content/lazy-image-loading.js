/**
 *
 * Lazy Image Loading
 *
 * @author Takuto Yanagida @ Space-Time Inc.
 * @version 2019-07-19
 *
 */


window.ST = window['ST'] || {};


(function (NS) {

	const SEL_TARGET = '.stile';
	const OFFSET     = 100;


	NS.addInit(2, initialize);


	// -------------------------------------------------------------------------


	function initialize() {
		const imgs      = document.querySelectorAll(SEL_TARGET + ' img');
		const imgsInTbl = document.querySelectorAll(SEL_TARGET + ' table img');

		for (let i = 0; i < imgs.length; i += 1) {
			const img = imgs[i];
			if ([].indexOf.call(imgsInTbl, img) !== -1) continue;
			if (img.getBoundingClientRect().top >= window.innerHeight + OFFSET) hide(img);
		}
		NS.onScroll(onScroll, true);

		function onScroll() {
			for (let i = 0; i < imgs.length; i += 1) {
				const img = imgs[i];
				if (!img.dataset.src) continue;
				if (img.getBoundingClientRect().top < window.innerHeight + OFFSET) show(img);
			}
		}

		NS.onBeforePrint(onPrint);
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
			setTimeout(() => { img.style.opacity = ''; }, 200);
		}
	}

})(window.ST);
