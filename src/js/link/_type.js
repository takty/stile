/**
 *
 * Type
 *
 * @author Takuto Yanagida
 * @version 2022-08-05
 *
 */


function apply(as, opts = {}) {
	opts = Object.assign({
		styleLinkImage     : ':ncLinkImage',
		styleLinkSimple    : ':ncLinkSimple',
		styleLinkAnchor    : ':ncLinkAnchor',
		styleLinkExternal  : ':ncLinkExternal',
		styleLinkFile      : ':ncLinkFile',
		styleLinkToImage   : ':ncLinkToImage',
		allowedClasses     : ALLOWED_CLASSES,
		fileExtensionTable : FILE_EXT_TABLE,
		imageExtensionTable: IMG_EXT_TABLE,
		isUrlExternal      : isUrlExternal,
		observedSelector   : null,
	}, opts);

	for (const a of as) {
		addClass(a, a.getAttribute('href'), opts);
	}
	initializeObservation(opts);
}

function applyByUrl(as, opts = {}) {
	opts = Object.assign({
		styleLinkAnchor    : ':ncLinkAnchor',
		styleLinkExternal  : ':ncLinkExternal',
		styleLinkFile      : ':ncLinkFile',
		styleLinkToImage   : ':ncLinkToImage',
		fileExtensionTable : FILE_EXT_TABLE,
		imageExtensionTable: IMG_EXT_TABLE,
		isUrlExternal      : isUrlExternal,
		observedSelector   : null,
	}, opts);

	for (const a of as) {
		addClassByUrl(a, a.getAttribute('href'), opts);
	}
	initializeObservation(opts);
}

const ALLOWED_CLASSES = [
	'alignleft',
	'aligncenter',
	'alignright',
	'size-thumbnail',
	'size-small',
	'size-medium-small',
	'size-medium',
	'size-medium-large',
	'size-medium_large',
	'size-large',
	'size-full'
];

const FILE_EXT_TABLE = {
	doc : 'doc',
	docx: 'doc',
	xls : 'xls',
	xlsx: 'xls',
	ppt : 'ppt',
	pptx: 'ppt',
	pdf : 'pdf',
};

const IMG_EXT_TABLE = {
	jpeg: 'jpg',
	jpg : 'jpg',
	png : 'png',
	gif : 'gif',
};


// -------------------------------------------------------------------------


const observing = [];

function initializeObservation(opts) {
	const sel = opts['observedSelector'];
	if (sel && !observing.includes(sel)) {
		observing.push(sel);
		const os = document.querySelectorAll(sel);
		observeAddition(os, o => addClassByUrl(o, o.getAttribute('href'), opts));
	}
}

function addClass(a, url, opts) {
	if (isImageLink(a, opts)) {
		setClass(a, opts.styleLinkImage);
		const ti = opts.imageExtensionTable[getFileExtension(url)] ?? null;
		if (ti) {
			setClass(a, opts.styleLinkToImage);
			setClass(a, opts.styleLinkToImage, true, ti);
		}
	} else {
		if (isEmptyLink(a)) {
			addClassByUrl(a, url, opts);
		} else if (isSimpleLink(a)) {
			setClass(a, opts.styleLinkSimple);
			if (isSimpleUrlLink(a, url)) {
				setClass(a, opts.styleLinkSimple, true, 'url');
			}
			addClassByUrl(a, url, opts);
		}
	}
}

function isImageLink(a, opts) {
	if (a.className) {
		for (const c of a.className.split(' ')) {
			if (!opts.allowedClasses.includes(c)) return false;
		}
	}
	let ok = false;
	for (const c of a.childNodes) {
		if (c.nodeType === 1) {  // ELEMENT_NODE
			if (!ok && c.tagName === 'IMG') {
				ok = true;
			} else {
				ok = false;
				break;
			}
		}
	}
	return ok;
}

function isSimpleLink(a) {
	if (a.className) return false;
	const cs = a.childNodes;
	if (cs.length === 0) return false;
	for (const c of cs) {
		if (c.className) return false;
		if (c.nodeType === 1) {  // ELEMENT_NODE
			if (c.tagName !== 'BR' && !getComputedStyle(c).display.includes('inline')) {
				return false;
			}
		}
	}
	return true;
}

function isEmptyLink(a) {
	return !a.className && a.childNodes.length === 0;
}

function isSimpleUrlLink(a, url) {
	return url !== null && url !== '' && a.childNodes.length && a.innerHTML.trim() === url;
}


// -------------------------------------------------------------------------


function addClassByUrl(a, url, opts) {
	const outIsUp = [false];
	if (isUrlAnchor(url, a, outIsUp)) {
		setClass(a, opts.styleLinkAnchor, true, outIsUp[0] ? 'up' : '');
	} else if (opts.isUrlExternal(url)) {
		setClass(a, opts.styleLinkExternal);
	}
	const ex = getFileExtension(url);
	const tf = opts.fileExtensionTable[ex]  ?? null;
	const ti = opts.imageExtensionTable[ex] ?? null;
	if (tf) {
		setClass(a, opts.styleLinkFile);
		setClass(a, opts.styleLinkFile, true, tf);
	}
	if (ti) {
		setClass(a, opts.styleLinkToImage);
		setClass(a, opts.styleLinkToImage, true, ti);
	}
}

function isUrlExternal(url) {
	if (url !== null && url !== '') {
		if (!url.startsWith(`${location.protocol}//${location.host}`)) {
			if (url.match(/^https?:\/\//) || url.match(/^\/\//)) {
				return true;
			}
		}
	}
	return false;
}

function getFileExtension(url) {
	if (url) {
		const b0 = url.indexOf('//');
		if (b0 !== -1) {
			const b1 = url.indexOf('/', b0 + 2);
			url = (b1 !== -1) ? url.substring(b1 + 1) : '';
		}
		const e0 = url.indexOf('?');
		if (e0 !== -1) url = url.substring(0, e0);
		const e1 = url.indexOf('#');
		if (e1 !== -1) url = url.substring(0, e1);

		if (!url.endsWith('/')) {
			const last = url.split('/').pop();

			const i = last.lastIndexOf('.');
			if (i !== -1) {
				return last.substring(i + 1).toLowerCase();
			}
		}
	}
	return null;
}
