/**
 *
 * Content Style - Image (JS)
 *
 * @author Takuto Yanagida @ Space-Time Inc.
 * @version 2017-08-28
 *
 */


document.addEventListener('DOMContentLoaded', function () {

	var TARGET_SELECTOR = '.stile';

	initializeLazyImageLoading();
	modifyFigureStyle();


	// -------------------------------------------------------------------------
	// Figure Styles

	function modifyFigureStyle() {
		var figs = document.querySelectorAll(TARGET_SELECTOR + ' figure');
		for (var i = 0; i < figs.length; i += 1) {
			figs[i].style.width = '';
		}
	}


	// -------------------------------------------------------------------------
	// Lazy Image Loading

	function initializeLazyImageLoading() {
		var OFFSET = 100;
		var imgs = document.querySelectorAll(TARGET_SELECTOR + ' img');

		var winY = window.scrollY | window.pageYOffset;
		for (var i = 0; i < imgs.length; i += 1) {
			var img = imgs[i];
			if (elementTopOnWindow(img) >= winY + window.innerHeight + OFFSET) hide(img);
		}
		window.addEventListener('scroll', onScroll);
		onScroll();

		function onScroll() {
			var winY = window.scrollY | window.pageYOffset;
			for (var i = 0; i < imgs.length; i += 1) {
				var img = imgs[i];
				if (!img.dataset.src) continue;
				if (elementTopOnWindow(img) < winY + window.innerHeight + OFFSET) show(img);
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
		var h = img.getAttribute('height');
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
		setTimeout((function (img) {return function () {img.style.opacity = '';};})(img), 200);
	}

	function elementTopOnWindow(elm) {
		var top = 0;
		while (elm) {
			top += elm.offsetTop;
			elm = elm.offsetParent;
		}
		return top;
	}

});
