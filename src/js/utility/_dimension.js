/**
 * Custom property of element dimensions
 *
 * @author Takuto Yanagida
 * @version 2023-02-01
 */

function apply(opts = {}) {
	opts = Object.assign({
		root: document.body,
		key : 'ncDim',
	}, opts);

	const ro = new ResizeObserver(es => {
		for (const e of es) {
			calc(e.target);
		}
	});

	onLoad(() => {
		add(opts.root);

		const mo = new MutationObserver(es => {
			for (const e of es) {
				if ('childList' === e.type) {
					add(e.target);
				}
			}
		});
		mo.observe(opts.root, { childList: true });
	});

	function add(root) {
		if (root.dataset[opts.key]) {
			ro.observe(root, { box: 'border-box' });
		}
		const ts = root.querySelectorAll(`*[data-${opts.key.replace(/([A-Z])/g, c => '-' + c.charAt(0).toLowerCase())}]`);
		for (const t of ts) {
			ro.observe(t, { box: 'border-box' });
		}
	}

	function calc(elm) {
		const q = elm.dataset[opts.key];
		if (!q) return;

		const qs  = q.split(';').map(e => e.trim());
		const qss = qs.map(e => e.split(':').map(e => e.trim()));

		for (let [cp, ep] of qss) {
			if (!cp.startsWith('--')) {
				cp = '--' + cp;
			}
			if (ep in elm && !isNaN(elm[ep])) {
				opts.root.style.setProperty(cp, elm[ep] + 'px');
			} else {
				if (!(ep in elm)) {
					console.log(`nacss.utility.dimension: property '${ep}' does not exists in the element`);
				} else if (isNaN(elm[ep])) {
					console.log(`nacss.utility.dimension: property '${ep}' is not a number`);
				}
			}
		}
	}
}
