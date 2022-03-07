/**
 *
 * Custom
 *
 * @author Takuto Yanagida
 * @version 2021-12-26
 *
 */


function apply(uls, opts = {}) {
	opts = Object.assign({
		styleList     : ':ncList',
		customType: [],
		doClearStyle  : true,
	}, opts);

	for (const ul of uls) {
		setStyle(ul, opts);
	}
}

function setStyle(t, opts) {
	const type = t.style.listStyleType;
	if (type !== '' && type !== 'none' && opts.customType.includes(type)) {
		if (opts.doClearStyle) {
			const re = new RegExp('list-style\\s*:\\s*' + type + '\\s*;?', 'gi');
			if (t.getAttribute('style').match(re)) {
				t.removeAttribute('style');
			} else {
				t.style.listStyleType = '';
			}
		}
		setClass(t, opts.styleList, true, type);
	}
}
