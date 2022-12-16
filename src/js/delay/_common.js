/**
 *
 * Common Functions
 *
 * @author Takuto Yanagida
 * @version 2021-11-11
 *
 */


function saveAttribute(t, at, alt = null) {
	const v = t.getAttribute(at);
	if (v) {
		t.dataset[at] = v;
		if (alt) {
			t.setAttribute(at, alt);
		} else {
			t.removeAttribute(at);
		}
	}
}

function restoreAttribute(t, at) {
	const v = t.dataset[at];
	if (v) {
		t.setAttribute(at, v);
		delete t.dataset[at];
	}
}

function isPolyfillNeeded(proto) {
	return (!('loading' in proto));
}
