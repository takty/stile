/**
 *
 * Content Style (JS)
 *
 * @author Takuto Yanagida @ Space-Time Inc.
 * @version 2017-12-26
 *
 */


document.addEventListener('DOMContentLoaded', function () {

	var TARGET_SELECTOR = '.stile';
	var TARGET_SELECTOR_ANCHOR = '.stile-anchor';
	var TARGET_SELECTOR_ANCHOR_EXTERNAL = '.stile-anchor-external';

	modifySpanStyle();

	var as = document.querySelectorAll(TARGET_SELECTOR + ' a');
	modifyAnchorStyle(as);
	as = document.querySelectorAll(TARGET_SELECTOR_ANCHOR + ' a');
	modifyAnchorStyle(as);
	as = document.querySelectorAll(TARGET_SELECTOR_ANCHOR_EXTERNAL + ' a');
	modifyAnchorStyleExternal(as);


	// -------------------------------------------------------------------------
	// Span Styles

	function modifySpanStyle() {
		var spans = document.querySelectorAll(TARGET_SELECTOR + ' span');
		for (var i = 0; i < spans.length; i += 1) {
			var target = spans[i];
			var type = target.style.textDecorationLine;
			if (type === undefined) {  // for IE11, Edge
				type = target.style.textDecoration;
				if (type === 'underline') {
					target.style.textDecoration = '';
					target.dataset.textDecorationLine = type;
				}
			} else {
				if (type === 'underline') {
					target.style.textDecorationLine = '';
					target.dataset.textDecorationLine = type;
				}
			}
		}
	}


	// -------------------------------------------------------------------------
	// Anchor Styles

	function modifyAnchorStyle(as) {
		for (var i = 0; i < as.length; i += 1) {
			var a = as[i];
			if (!isSimple(a)) continue;
			a.dataset.style = a.dataset.style ? (a.dataset.style + ' simple-link') : 'simple-link';
			if (isExternal(a.getAttribute('href'))) {
				a.dataset.style = a.dataset.style ? (a.dataset.style + ' external-link') : 'external-link';
			}
		}
	}

	function modifyAnchorStyleExternal(as) {
		for (var i = 0; i < as.length; i += 1) {
			var a = as[i];
			if (isExternal(a.getAttribute('href'))) {
				a.dataset.style = a.dataset.style ? (a.dataset.style + ' external-link') : 'external-link';
			}
		}
	}

	function isExternal(url) {
		if (url === null || url === '') {
			return false;
		} else if (url.indexOf(location.protocol + '//' + location.host) === 0) {
			return false;
		} else if (url.match(/^https?:\/\//)) {
			return true;
		}
		return false;
	}

	function isSimple(a) {
		if (a.className) return false;
		var cs = a.childNodes;
		for (var i = 0; i < cs.length; i += 1) {
			if (cs[i].className) return false;
		}
		for (var i = 0; i < cs.length; i += 1) {
			var tn = cs[i].tagName;
			if (tn === 'BR') continue;
			if (tn) return false;
		}
		return true;
	}

});
