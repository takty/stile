/**
 *
 * Content Style (JS)
 *
 * @author Takuto Yanagida @ Space-Time Inc.
 * @version 2018-05-24
 *
 */


let ST = ST || {};


document.addEventListener('DOMContentLoaded', function () {

	const TARGET_SELECTOR = '.stile';
	const TARGET_SELECTOR_ANCHOR = '.stile-anchor';
	const TARGET_SELECTOR_ANCHOR_EXTERNAL = '.stile-anchor-external';

	const PERMITTED_CLASSES = ['alignleft', 'aligncenter', 'alignright', 'size-thumbnail', 'size-small', 'size-medium', 'size-medium_large', 'size-large', 'size-full'];

	modifySpanStyle();

	let as = document.querySelectorAll(TARGET_SELECTOR + ' a');
	modifyAnchorStyle(as);
	as = document.querySelectorAll(TARGET_SELECTOR_ANCHOR + ' a');
	modifyAnchorStyle(as);
	as = document.querySelectorAll(TARGET_SELECTOR_ANCHOR_EXTERNAL + ' a');
	modifyAnchorStyleExternal(as);

	const fs = document.querySelectorAll(TARGET_SELECTOR + ' iframe');
	modifyIframeStyle(fs);
	const figs = document.querySelectorAll(TARGET_SELECTOR + ' figure');
	modifyFigureStyle(figs);


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
					ST.addStile(target, 'inline-' + type);
				}
			} else {
				if (type === 'underline') {
					target.style.textDecorationLine = '';
					ST.addStile(target, 'inline-' + type);
				}
			}
		}
	}


	// -------------------------------------------------------------------------
	// Anchor Styles

	function modifyAnchorStyle(as) {
		for (let i = 0; i < as.length; i += 1) {
			const a = as[i];
			if (isImageLink(a)) {
				ST.addStile(a, 'link-image');
				continue;
			}
			if (!isSimple(a)) continue;
			ST.addStile(a, 'link-simple');
			const url = a.getAttribute('href');
			if (isUrlLink(a, url)) {
				ST.addStile(a, 'link-url');
			}
			if (isExternal(url)) {
				ST.addStile(a, 'link-external');
			} else if (isAnchor(url)) {
				ST.addStile(a, 'link-anchor');
			}
		}
	}

	function modifyAnchorStyleExternal(as) {
		for (let i = 0; i < as.length; i += 1) {
			const a = as[i];
			const url = a.getAttribute('href');
			if (isExternal(url)) {
				ST.addStile(a, 'link-external');
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

	function isImageLink(a) {
		if (a.className) {
			const cs = a.className.split(' ');
			for (let i = 0; i < cs.length; i += 1) {
				if (PERMITTED_CLASSES.indexOf(cs[i]) === -1) return false;
			}
		}
		const cs = a.childNodes;
		if (cs.length === 0) return false;
		let success = false;
		for (let i = 0; i < cs.length; i += 1) {
			const tn = cs[i].tagName;
			if (success === false && tn === 'IMG') {
				success = true;
				continue;
			}
			if (tn) return false;
		}
		return success;
	}


	// -------------------------------------------------------------------------
	// Iframe Styles

	function modifyIframeStyle(fs) {
		for (let i = 0; i < fs.length; i += 1) {
			const f = fs[i];
			const width = f.width;
			const height = f.height;
			const wrap = document.createElement('SPAN');
			ST.addStile(wrap, 'iframe-wrapper');
			const spacer = document.createElement('DIV');
			spacer.style.paddingTop = (100 * height / width) + '%';
			wrap.appendChild(spacer);
			wrap.style.maxWidth = width + 'px';
			f.parentElement.insertBefore(wrap, f);
			wrap.appendChild(f);
		}
	}


	// -------------------------------------------------------------------------
	// Figure Styles

	function modifyFigureStyle(figs) {
		for (let i = 0; i < figs.length; i += 1) {
			figs[i].style.width = '';
		}
	}

});
