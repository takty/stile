/**
 *
 * Scroll Effect
 *
 * @author Takuto Yanagida
 * @version 2021-12-26
 *
 */


function apply(ts, opts = {}) {
	if (ts.length === 0) return;

	opts = Object.assign({
		styleEffect: ':ncScrollEffect',
	}, opts);

	onIntersect(doIntersect, ts, 0.5, '* 10000% 0px 10000%');
	function doIntersect(vs) {
		for (let i = 0; i < ts.length; i += 1) {
			if (vs[i]) setClass(ts[i], opts['styleEffect'], true, 'visible');
		}
	}

	window.addEventListener('beforeprint', () => {
		for (const c of ts) {
			setClass(c, opts['styleEffect'], true, 'visible');
		}
	});
}
