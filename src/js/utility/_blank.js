/**
 * Polyfill of pseudo class 'blank'
 *
 * @author Takuto Yanagida
 * @version 2023-02-10
 */

function apply(opts = {}) {
	opts = Object.assign({
		root    : document.documentElement,
		styleKey: ':ncBlank',
	}, opts);

	onLoad(() => {
		apply(opts.root);
		const mo = new MutationObserver(ms => {
			for (const m of ms) {
				if ('childList' === m.type) apply(m.target);
			}
		});
		mo.observe(opts.root, { childList: true });
	});

	function apply(elm) {
		const ts = elm.querySelectorAll(getSelector(opts.styleKey));
		for (const t of ts) {
			if (!t.children.length) {
				while (t.firstChild) t.removeChild(t.firstChild);
			}
			setClass(t, opts.styleKey, false)
		}
	}
}
