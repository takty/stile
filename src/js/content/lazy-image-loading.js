/**
 *
 * Lazy Image Loading
 *
 * @author Takuto Yanagida @ Space-Time Inc.
 * @version 2022-07-11
 *
 */


window.ST = window['ST'] || {};


(function (NS) {

	const SEL_TARGET = '.stile';
	const OFFSET     = 100;
	const BLANK_IMG  = 'data:image/gif;base64,R0lGODdhAQABAPAAAP///wAAACwAAAAAAQABAEACAkQBADs=';


	NS.addInit(2, initialize);


	// -------------------------------------------------------------------------


	function initialize() {
		if ('loading' in HTMLImageElement.prototype) {
			return;
		}

		const imgs      = document.querySelectorAll(SEL_TARGET + ' img');
		const imgsInTbl = document.querySelectorAll(SEL_TARGET + ' table img');
		const imgsSkip  = document.querySelectorAll(SEL_TARGET + ' [data-stile~="no-lazy-loading"] img');

		for (let i = 0; i < imgs.length; i += 1) {
			const img = imgs[i];
			if ([].indexOf.call(imgsInTbl, img) !== -1) continue;
			if ([].indexOf.call(imgsSkip, img) !== -1) continue;
			hide(img);
		}
		NS.onIntersect(onIntersect, true, { targets: imgs, marginBottom: OFFSET, threshold: 0 });
		function onIntersect(vs) {
			for (let i = 0; i < imgs.length; i += 1) {
				const img = imgs[i];
				if (!img.dataset.src) continue;
				if (vs[i]) show(img);
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
		saveSrc(img);
		img.style.opacity = 0;
		const h = img.getAttribute('height');
		if (h) img.style.minHeight = h + 'px';
	}

	function show(img, immediately = false) {
		if (immediately) {
			img.style.minHeight = '';
			img.style.opacity   = '';
		} else {
			img.addEventListener('load', () => {
				img.style.minHeight = '';
				img.style.opacity   = '';
			});
		}
		restoreSrc(img);
	}

	function saveSrc(img) {
		img.dataset['src'] = img.src;
		img.src = BLANK_IMG;
		if (img.srcset) {
			img.dataset['srcset'] = img.srcset;
			img.srcset = '';
		}
	}

	function restoreSrc(img) {
		if (img.dataset.srcset) {
			img.srcset = img.dataset.srcset;
			img.dataset.srcset = '';
		}
		img.src = img.dataset.src;
		img.dataset.src = '';
	}

})(window.ST);
