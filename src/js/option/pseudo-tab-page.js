/* eslint-disable no-underscore-dangle */
/**
 *
 * Pseudo Tab Page Classes (JS)
 *
 * @author Takuto Yanagida @ Space-Time Inc.
 * @version 2020-01-22
 *
 */


window.ST = window['ST'] || {};


(function (NS) {

	const SELECTOR_TARGET     = '.pseudo-tab-page';
	const CLS_TAB_LIST        = 'stile-pseudo-tab-page-tab-list';
	const ID_TAB_LIST_ID_BASE = '';
	const ST_STATE_CURRENT    = 'current';
	const SINGLE_TAB          = true;

	NS.addInit(4, () => {
		const tps = document.querySelectorAll(SELECTOR_TARGET);
		for (let i = 0; i < tps.length; i += 1) {
			create(tps[i], i);
		}
	});

	function create(container, idx) {
		const cont = {
			tabLineUls: [],
			focused   : null,
			tlVs      : null
		}
		const [hs, htmls] = extractHeaders(container);
		if (hs.length === 0) return false;

		const tls = [];
		for (let i = 0; i < hs.length; i += 1) {
			const tl = createTabLine(htmls, i, idx);
			container.insertBefore(tl.ul, hs[i]);
			tls.push(tl);
			cont.tabLineUls.push(tl.ul);
		}
		if (SINGLE_TAB) {
			for (let i = 0; i < tls.length; i += 1) {
				const tl = tls[i];
				NS.addStile(tl.ul, 'hidden');
				for (let j = 0; j < tl.as.length; j += 1) {
					tl.as[j].addEventListener('click', () => { onTabClick(cont, tls[j].ul); });
				}
			}
		}
		if (NS.assignAnchorOffset) NS.assignAnchorOffset(cont.tabLineUls);
		if (SINGLE_TAB) {
			updateVisibilityImmediately(cont);
			NS.onIntersect((vs) => {
				cont.tlVs = vs;
				updateVisibility(cont);
			}, true, { targets: cont.tabLineUls, marginTop: 'OFFSET', threshold: 0 });
		}
	}

	function createTabLine(htmls, tabIdx, contIdx) {
		const ul = document.createElement('ul');
		ul.id = ID_TAB_LIST_ID_BASE + (contIdx + 1) + '-' + (tabIdx + 1);
		ul.className = CLS_TAB_LIST;
		ul.classList.add('stile-link-target');

		const ios = document.body.classList.contains('ios');
		const stile = ios ? 'no-anchor-scroll' : 'anchor-scroll-fast';
		const as = [];

		for (let i = 0; i < htmls.length; i += 1) {
			const a = document.createElement('a');
			a.href = '#' + ID_TAB_LIST_ID_BASE + (contIdx + 1) + '-' + (i + 1);
			a.innerHTML = htmls[i];
			a.dataset['stile'] = stile;

			const li = document.createElement('li');
			li.appendChild(a);
			ul.appendChild(li);
			as.push(a);
		}
		NS.addStile(ul.children[tabIdx], ST_STATE_CURRENT);
		return { ul, as };
	}


	// -------------------------------------------------------------------------


	function extractHeaders(container) {
		const fh = getFirstHeading(container);
		if (!fh) return [[], []];
		const tn = fh.tagName;

		const hs    = [];
		const htmls = [];

		const cs = [].slice.call(container.children);
		for (let i = 0; i < cs.length; i += 1) {
			const c = cs[i];
			if (c.tagName === tn) {
				hs.push(c);
				htmls.push(c.innerHTML);
			}
		}
		return [hs, htmls];
	}

	function getFirstHeading(container) {
		const cs = container.children;
		for (let i = 0; i < cs.length; i += 1) {
			if (/^H[1-6]$/.test(cs[i].tagName)) return cs[i];
		}
		return null;
	}


	// -------------------------------------------------------------------------


	function onTabClick(cont, clicked) {
		cont.focused = clicked;
		updateVisibilityImmediately(cont);
	}

	function updateVisibilityImmediately(cont) {
		for (let i = 0; i < cont.tabLineUls.length; i += 1) {
			NS.addStile(cont.tabLineUls[i], 'immediately');
		}
		setTimeout(() => { updateVisibility(cont) }, 10);
		setTimeout(() => {
			for (let i = 0; i < cont.tabLineUls.length; i += 1) {
				NS.removeStile(cont.tabLineUls[i], 'immediately');
			}
			if (cont.focused) {
				const y = cont.focused.getBoundingClientRect().top;
				cont.focused = null;
				if (window.innerHeight < y) updateVisibility(cont);
			}
		}, 1000);
	}

	function updateVisibility(cont) {
		if (cont.focused && cont.tabLineUls.indexOf(cont.focused) !== -1) {
			for (let i = 0; i < cont.tabLineUls.length; i += 1) {
				const t = cont.tabLineUls[i];
				if (t === cont.focused) {
					NS.removeStile(t, 'hidden');
				} else {
					NS.addStile(t, 'hidden');
				}
			}
			return;
		}
		let shown = false;
		for (let i = 0; i < cont.tabLineUls.length; i += 1) {
			const t = cont.tabLineUls[i];
			const v = cont.tlVs ? cont.tlVs[i] : false;
			if (v && !shown) {
				shown = true;
				NS.removeStile(t, 'hidden');
			} else if (shown) {
				NS.addStile(t, 'hidden');
			}
		}
	}

})(window.ST);
