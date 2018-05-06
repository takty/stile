/**
 *
 * Content Style (JS)
 *
 * @author Takuto Yanagida @ Space-Time Inc.
 * @version 2018-05-05
 *
 */


document.addEventListener('DOMContentLoaded', function () {

	const TARGET_SELECTOR = '.stile';
	const TARGET_SELECTOR_ANCHOR = '.stile-anchor';
	const TARGET_SELECTOR_ANCHOR_EXTERNAL = '.stile-anchor-external';

	modifySpanStyle();

	let as = document.querySelectorAll(TARGET_SELECTOR + ' a');
	modifyAnchorStyle(as);
	as = document.querySelectorAll(TARGET_SELECTOR_ANCHOR + ' a');
	modifyAnchorStyle(as);
	as = document.querySelectorAll(TARGET_SELECTOR_ANCHOR_EXTERNAL + ' a');
	modifyAnchorStyleExternal(as);


	// -------------------------------------------------------------------------
	// Span Styles

	function modifySpanStyle() {
		const spans = document.querySelectorAll(TARGET_SELECTOR + ' span');
		for (let i = 0; i < spans.length; i += 1) {
			const target = spans[i];
			let type = target.style.textDecorationLine;
			if (type === undefined) {  // for IE11, Edge
				type = target.style.textDecoration;
				if (type === 'underline') {
					target.style.textDecoration = '';
					addDataStyle(target, 'inline-' + type);
				}
			} else {
				if (type === 'underline') {
					target.style.textDecorationLine = '';
					addDataStyle(target, 'inline-' + type);
				}
			}
		}
	}


	// -------------------------------------------------------------------------
	// Anchor Styles

	function modifyAnchorStyle(as) {
		for (let i = 0; i < as.length; i += 1) {
			const a = as[i];
			if (!isSimple(a)) continue;
			addDataStyle(a, 'link-simple');
			const url = a.getAttribute('href');
			if (isUrlLink(a, url)) {
				addDataStyle(a, 'link-url');
			}
			if (isExternal(url)) {
				addDataStyle(a, 'link-external');
			} else if (isAnchor(url)) {
				addDataStyle(a, 'link-anchor');
			}
		}
	}

	function modifyAnchorStyleExternal(as) {
		for (let i = 0; i < as.length; i += 1) {
			const a = as[i];
			const url = a.getAttribute('href');
			if (isExternal(url)) {
				addDataStyle(a, 'link-external');
			}
		}
	}

	function isAnchor(url) {
		const pos = url.indexOf('#');
		if (pos === -1) return false;
		const id = url.substr(pos + 1);
		const tar = document.getElementById(id);
		return tar !== null;
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
		const cs = a.childNodes;
		if (cs.length === 0) return false;
		for (let i = 0; i < cs.length; i += 1) {
			if (cs[i].className) return false;
		}
		for (let i = 0; i < cs.length; i += 1) {
			const tn = cs[i].tagName;
			if (tn === 'BR') continue;
			if (tn) return false;
		}
		return true;
	}

	function isUrlLink(a, url) {
		const cs = a.childNodes;
		if (cs.length === 0) return false;
		return a.innerHTML.trim() === url;
	}

	function addDataStyle(elm, style) {
		if (elm.dataset.stile) {
			elm.dataset.stile = elm.dataset.stile + ' ' + style;
		} else {
			elm.dataset.stile = style;
		}
	}

});
