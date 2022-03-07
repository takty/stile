/**
 *
 * Selector Attributes
 *
 * @author Takuto Yanagida
 * @version 2022-01-07
 *
 */


function apply(ts, opts = {}) {
	if (ts.length === 0) return;

	opts = Object.assign({
		styleHasOnlyChild: ':ncHasOnlyChild',
		stylePrefixNextTo: ':ncNextTo',
	}, opts);

	addHasOnlyChild(ts, opts['styleHasOnlyChild']);
	addNextTo(ts, opts['stylePrefixNextTo']);
}

function addHasOnlyChild(es, styleHasOnlyChild) {
	for (const e of es) {
		if (hasOnlyChildOne(e)) {
			setClass(e.parentElement, styleHasOnlyChild);
		}
	}
}

function hasOnlyChildOne(e) {
	for (const c of [...e.parentElement.childNodes]) {
		if (
			(c.nodeType === 1 /*ELEMENT_NODE*/ && c !== e) ||
			(c.nodeType === 3 /*TEXT_NODE*/ && c.textContent.trim() !== '')
		) {
			return false;
		}
	}
	return true;
}

function addNextTo(es, stylePrefixNextTo) {
	for (const e of es) {
		const prev = e.previousElementSibling;
		if (prev && prev.className === '') {
			const tn = prev.tagName.toLowerCase();
			const cc = tn.charAt(0).toUpperCase() + tn.slice(1);
			setClass(e, stylePrefixNextTo + cc);
		}
	}
}
