/**
 *
 * Container Query (JS)
 *
 * @author Takuto Yanagida @ Space-Time Inc.
 * @version 2019-06-24
 *
 */


window.ST = window['ST'] || {};


(function (NS) {

	const SEL_TARGET = '*[data-cq]';

	let items = null;

	NS.addInit(5, () => {
		items = init(document.querySelectorAll(SEL_TARGET));
		NS.onResize(onResize);
		onResize();
	});


	// -------------------------------------------------------------------------


	function init(elms) {
		const items = [];
		for (let i = 0; i < elms.length; i += 1) {
			const elm = elms[i];
			const qs = elm.dataset['cq'].split(';')
				.map((e) => e.trim())
				.filter((e) => e !== '');
			const pqs = parseQuery(qs);
			if (pqs.length) items.push([elm, pqs]);
		}
		return items;
	}

	function parseQuery(qs) {
		const pqs = [];
		for (let i = 0; i < qs.length; i += 1) {
			const cls2cs = parseOneQuery(qs[i]);
			if (cls2cs) pqs.push(cls2cs);
		}
		return pqs;
	}

	function parseOneQuery(q) {
		const re = /(min|max)/;

		const [cls, estr] = q.split(':').map((e) => e.trim());
		const es = estr.split('&').map((e) => e.trim());
		const cs = [];

		for (let i = 0; i < es.length; i += 1) {
			const e = es[i];
			const ms = e.match(re);
			if (ms) {
				const t = ms[0];
				const v = parseInt(e.replace(t, '').trim());
				cs.push([t, v]);
			}
		}
		if (cs.length) return [cls, cs];
		return null;
	}


	// -------------------------------------------------------------------------


	function onResize() {
		for (let i = 0; i < items.length; i += 1) {
			const [elm, pqs] = items[i];
			evalQuery(elm, pqs, elm.parentElement.offsetWidth);
		}
	}

	function evalQuery(elm, pqs, w) {
		const clss = new Map();
		for (let i = 0; i < pqs.length; i += 1) {
			const [cls, cs] = pqs[i];
			if (!clss.has(cls)) clss.set(cls, false);
			const match = evalOneQuery(cs, w);
			if (match) clss.set(cls, true);
		}
		clss.forEach((match, cls) => {
			if (match) elm.classList.add(cls);
			else elm.classList.remove(cls);
		});
	}

	function evalOneQuery(cs, w) {
		for (let i = 0; i < cs.length; i += 1) {
			const [type, val] = cs[i];
			switch (type) {
			case 'min':
				if (val > w) return false;
				break;
			case 'max':
				if (val < w) return false;
				break;
			}
		}
		return true;
	}

})(window.ST);
