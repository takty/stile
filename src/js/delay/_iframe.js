/**
 *
 * Iframe
 *
 * @author Takuto Yanagida
 * @version 2021-12-26
 *
 */


function apply(ts, opts = {}) {
	if (ts.length === 0) return;

	opts = Object.assign({
		offset : 100,
		doForce: true,
	}, opts);

	if (isPolyfillNeeded(HTMLIFrameElement.prototype)) {  // For Safari
		setPolyfill(ts, opts);
	} else if (opts['doForce']) {
		const np = ts.filter(e => !e.getAttribute('loading'));
		setPolyfill(np, opts);
	}

	window.addEventListener('beforeprint', () => {
		for (const t of ts) {
			if (t.dataset.src) {
				show(t);
			}
			if (t.getAttribute('loading') === 'lazy') {
				t.setAttribute('loading', 'eager');
			}
		}
	}, false);
}

function setPolyfill(ts, opts) {
	for (const t of ts) {
		console.log(t);
		hide(t);
	}
	onIntersect(vs => {
		for (let i = 0; i < ts.length; i += 1) {
			const t = ts[i];
			if (t.dataset.src && vs[i]) {
				show(t);
			}
		}
	}, ts, 0, `* 0px ${opts['offset']}px 0px`);
}

function hide(t) {
	saveAttribute(t, 'src');
}

function show(t) {
	const v = t.dataset['src'];
	if (v) {
		if (t.contentDocument) {
			t.contentDocument.location.replace(v);
		} else {
			t.setAttribute('src', v);
		}
		delete t.dataset['src'];
	}
}
