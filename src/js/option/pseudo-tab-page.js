/* eslint-disable no-underscore-dangle */
/**
 *
 * Pseudo Tab Page Classes (JS)
 *
 * @author Takuto Yanagida @ Space-Time Inc.
 * @version 2019-07-29
 *
 */


window.ST = window['ST'] || {};


(function (NS) {

	const SELECTOR_TARGET     = '.pseudo-tab-page';
	const CLS_TAB_LIST        = 'stile-pseudo-tab-page-tab-list';
	const ID_TAB_LIST_ID_BASE = '';
	const ST_STATE_CURRENT    = 'current';
	const SINGLE_TAB          = true;

	const tabLineUls = [];
	let focused = null;
	let tlVs = null;

	NS.addInit(4, () => {
		const tps = document.querySelectorAll(SELECTOR_TARGET);
		for (let i = 0; i < tps.length; i += 1) {
			createTabPage(tps[i], i);
		}
		if (NS.assignAnchorOffset) NS.assignAnchorOffset(tabLineUls);
		if (SINGLE_TAB) {
			updateVisibilityImmediately();
			NS.onIntersect((vs) => {
				tlVs = vs;
				updateVisibility();
			}, true, { targets: tabLineUls, marginTop: 'OFFSET', threshold: 0 });
		}
	});

	function createTabPage(container, idx) {
		const [hs, htmls] = extractHeaders(container);
		if (hs.length === 0) return false;

		const tls = [];
		for (let i = 0; i < hs.length; i += 1) {
			const tl = createTabLine(htmls, i, idx);
			container.insertBefore(tl.ul, hs[i]);
			tls.push(tl);
			tabLineUls.push(tl.ul);
		}
		if (SINGLE_TAB) {
			for (let i = 0; i < tls.length; i += 1) {
				const tl = tls[i];
				NS.addStile(tl.ul, 'hidden');
				for (let j = 0; j < tl.as.length; j += 1) {
					tl.as[j].addEventListener('click', () => { onTabClick(tls[j].ul); });
				}
			}
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


	function onTabClick(clicked) {
		focused = clicked;
		updateVisibilityImmediately();
	}

	function updateVisibilityImmediately() {
		for (let i = 0; i < tabLineUls.length; i += 1) {
			NS.addStile(tabLineUls[i], 'immediately');
		}
		setTimeout(() => { updateVisibility() }, 10);
		setTimeout(() => {
			for (let i = 0; i < tabLineUls.length; i += 1) {
				NS.removeStile(tabLineUls[i], 'immediately');
			}
			if (focused) {
				const y = focused.getBoundingClientRect().top;
				focused = null;
				if (window.innerHeight < y) updateVisibility();
			}
		}, 1000);
	}

	function updateVisibility() {
		if (focused && tabLineUls.indexOf(focused) !== -1) {
			for (let i = 0; i < tabLineUls.length; i += 1) {
				const t = tabLineUls[i];
				if (t === focused) {
					NS.removeStile(t, 'hidden');
				} else {
					NS.addStile(t, 'hidden');
				}
			}
			return;
		}
		let shown = false;
		for (let i = 0; i < tabLineUls.length; i += 1) {
			const t = tabLineUls[i];
			const v = tlVs ? tlVs[i] : false;
			if (v && !shown) {
				shown = true;
				NS.removeStile(t, 'hidden');
			} else if (shown) {
				NS.addStile(t, 'hidden');
			}
		}
	}

})(window.ST);
