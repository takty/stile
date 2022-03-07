/**
 *
 * Image
 *
 * @author Takuto Yanagida
 * @version 2021-12-26
 *
 */


const BLANK_IMG = 'data:image/gif;base64,R0lGODdhAQABAPAAAP///wAAACwAAAAAAQABAEACAkQBADs=';


function apply(ts, opts = {}) {
	if (ts.length === 0) return;

	opts = Object.assign({
		offset    : 100,
		blankImage: BLANK_IMG,
		doForce   : true,
	}, opts);

	for (const t of ts) {
		if (t.getAttribute('loading')) {
			t.setAttribute('loading', 'lazy');
		}
	}

	if (isPolyfillNeeded(HTMLImageElement.prototype)) {  // For Safari
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
		hide(t, opts['blankImage']);
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

function hide(t, blankImage) {
	saveAttribute(t, 'src', blankImage);
	saveAttribute(t, 'srcset');
	t.style.opacity = 0;
	const h = t.getAttribute('height');
	if (h) {
		t.style.minHeight = h + 'px';
	}
}

function show(t) {
	t.addEventListener('load', () => {
		t.style.minHeight = '';
		t.style.opacity   = '';
	});
	restoreAttribute(t, 'src');
	restoreAttribute(t, 'srcset');
}
