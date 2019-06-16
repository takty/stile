/**
 *
 * Link Style (JS)
 *
 * @author Takuto Yanagida @ Space-Time Inc.
 * @version 2019-06-16
 *
 * The function 'isExternalUrl' can be overwritten as follows:
 * <script>ST.isExternalUrl = function (url) { return true; }</script>
 *
 */


window.ST = window['ST'] || {};


(function (NS) {

	const SEL_TARGET                 = '.stile';
	const SEL_TARGET_ANCHOR          = '.stile-anchor';
	const SEL_TARGET_ANCHOR_EXTERNAL = '.stile-anchor-external';

	const PERMITTED_CLASSES = ['alignleft', 'aligncenter', 'alignright', 'size-thumbnail', 'size-small', 'size-medium-small', 'size-medium', 'size-medium-large', 'size-medium_large', 'size-large', 'size-full'];
	const EXT_TABLE = { doc: 'word', docx: 'word', xls: 'excel', xlsx: 'excel', ppt: 'powerpoint', pptx: 'powerpoint', pdf: 'pdf' };

	NS.isImageLink = isImageLink;  // Export the function
	NS.addInit(2, () => {
		let as = document.querySelectorAll(SEL_TARGET + ' a');
		modifyAnchorStyle(as);
		as = document.querySelectorAll(SEL_TARGET_ANCHOR + ' a');
		modifyAnchorStyle(as);
		as = document.querySelectorAll(SEL_TARGET_ANCHOR_EXTERNAL + ' a');
		modifyAnchorStyleExternal(as);
	});


	// -------------------------------------------------------------------------


	function modifyAnchorStyle(as) {
		for (let i = 0; i < as.length; i += 1) {
			const a = as[i];
			if (isImageLink(a)) {
				NS.addStile(a, 'link-image');
				continue;
			}
			if (isEmpty(a)) {
				const url = a.getAttribute('href');
				if (isExternal(url)) NS.addStile(a, 'link-external');
				continue;
			}
			if (isSimple(a)) {
				NS.addStile(a, 'link-simple');

				const url = a.getAttribute('href');
				if (isAnchor(url)) {
					NS.addStile(a, 'link-anchor');
				} else {
					if (isUrlLink(a, url)) NS.addStile(a, 'link-url');
					if (isExternal(url)) NS.addStile(a, 'link-external');
				}
				addFileType(a, url);
			}
		}
	}

	function modifyAnchorStyleExternal(as) {
		for (let i = 0; i < as.length; i += 1) {
			const a = as[i];
			const url = a.getAttribute('href');
			if (isExternal(url)) {
				NS.addStile(a, 'link-external');
			}
		}
	}


	// -------------------------------------------------------------------------


	// Exported function
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

	function isEmpty(a) {
		if (a.className) return false;
		const cs = a.childNodes;
		return (cs.length === 0);
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
			if (tn && isInlineElement(cs[i])) continue;
			if (tn) return false;
		}
		return true;
	}

	function isAnchor(url) {
		const pos = url.indexOf('#');
		if (pos === -1) return false;
		const id = url.substr(pos + 1);
		const tar = document.getElementById(id);
		return tar !== null;
	}

	function isUrlLink(a, url) {
		const cs = a.childNodes;
		if (cs.length === 0) return false;
		return a.innerHTML.trim() === url;
	}

	function isInlineElement(elm) {
		const d = getComputedStyle(elm).display;
		return d.indexOf('inline') !== -1;
	}


	// -------------------------------------------------------------------------


	// Private function
	function isExternal(url) { return NS.isExternalUrl(url); }

	// Exported function
	function isExternalUrl(url) {
		if (url === null || url === '') return false;
		if (url.indexOf(location.protocol + '//' + location.host) === 0) return false;
		if (url.match(/^https?:\/\//)) return true;
		if (url.match(/^\/\//)) return true;
		return false;
	}

	// Export the function
	NS.isExternalUrl = isExternalUrl;


	// -------------------------------------------------------------------------


	function addFileType(a, url) {
		if (url.length > 0 && url[url.length - 1] === '/') return;
		const dom = url.indexOf('//');
		if (dom !== -1) {
			const fs = url.indexOf('/', dom + 2);
			if (fs === -1) return;
			url = url.substr(fs + 1);
		}
		const idx = url.lastIndexOf('.');
		if (idx === -1) return;
		const ext = url.substr(idx + 1);

		const type = EXT_TABLE[ext];
		if (type) {
			NS.addStile(a, 'link-file');
			NS.addStile(a, 'link-file-' + type);
		}
	}

})(window.ST);
