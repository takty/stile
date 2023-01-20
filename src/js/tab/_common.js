/**
 * Common Functions
 *
 * @author Takuto Yanagida
 * @version 2022-01-07
 */

function getFirstHeading(container) {
	const cs = container.children;
	for (let i = 0; i < cs.length; i += 1) {
		if (/^H[1-6]$/.test(cs[i].tagName)) return cs[i];
	}
	return null;
}

function createAnchor(h) {
	const a = document.createElement('a');
	a.href  = '#' + h.id;
	a.title = h.elm.innerText;
	const t = h.elm.title ? h.elm.title : h.elm.innerHTML;

	a.innerHTML = t;
	a.querySelectorAll('small').forEach(e => e.remove());
	if (a.innerText === '') {
		a.innerHTML = t;
	}
	spanning(a);
	return a;
}

function spanning(e) {
	for (const c of [...e.children]) {
		if (c.tagName === 'A' || c.tagName === 'SMALL') {
			const s = document.createElement('span');
			s.innerHTML = c.innerHTML;
			e.replaceChild(s, c);
			spanning(s);
		} else {
			spanning(c);
		}
	}
}
