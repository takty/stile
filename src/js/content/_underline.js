/**
 *
 * Underline
 *
 * @author Takuto Yanagida
 * @version 2021-12-27
 *
 */


function apply(spans, opts = {}) {
	opts = Object.assign({
		styleList: ':ncUnderline',
	}, opts);

	for (const span of spans) {
		setStyle(span, opts);
	}
}

function setStyle(t, opts) {
	let type = t.style.textDecorationLine;
	if (type === '') type = t.style.textDecoration;  // For Safari

	if (type === 'underline') {
		const re = new RegExp('^text-decoration\\s*:\\s*' + type + '\\s*;?$', 'gi');
		if (t.getAttribute('style').trim().match(re)) {
			t.removeAttribute('style');
		} else {
			if (t.style.textDecorationLine !== '') {
				t.style.textDecorationLine = '';
			} else {
				t.style.textDecoration = '';
			}
		}
		setClass(t, opts.styleList);
	}
}
