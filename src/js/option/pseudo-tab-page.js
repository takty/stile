/**
 *
 * Pseudo Tab Page Classes (JS)
 *
 * @author Takuto Yanagida @ Space-Time Inc.
 * @version 2019-06-16
 *
 */


window.ST = window['ST'] || {};


(function (NS) {

	const SELECTOR_TARGET     = '.pseudo-tab-page';
	const CLS_TAB_LIST        = 'stile-pseudo-tab-page-tab-list';
	const ID_TAB_LIST_ID_BASE = '';
	const ST_STATE_CURRENT    = 'current';
	const SINGLE_TAB          = true;

	NS.addInit(3, () => {
		const tabUlss = [];
		const tps = document.querySelectorAll(SELECTOR_TARGET);
		for (let i = 0; i < tps.length; i += 1) {
			const tabUls = createTabPage(tps[i], i, tabUlss);
			if (tabUls !== false) tabUlss.push(tabUls);
		}
		if (SINGLE_TAB) initializeSingleTab(tabUlss);
	});

	function createTabPage(container, idx, tabUlss) {
		const fh = getFirstHeading(container);
		if (!fh) return false;
		const tabH = fh.tagName;

		const cs = [].slice.call(container.children);
		const hs = [];
		const htmls = [];

		for (let i = 0; i < cs.length; i += 1) {
			const c = cs[i];
			if (c.tagName === tabH) {
				hs.push(c);
				htmls.push(c.innerHTML);
			}
		}
		const tabUls = [];
		for (let i = 0; i < hs.length; i += 1) {
			const tp = createTab(htmls, i, idx, tabUls, tabUlss);
			container.insertBefore(tp.tabUl, hs[i]);
			tabUls.push(tp.tabUl);
		}
		if (NS.assignAnchorOffset) NS.assignAnchorOffset(tabUls);
		return tabUls;
	}

	function createTab(htmls, tabIdx, contIdx, tabUls, tabUlss) {
		const tp = {};
		tp.tabUl = document.createElement('ul');
		tp.tabUl.id = ID_TAB_LIST_ID_BASE + contIdx + '-' + tabIdx;
		tp.tabUl.className = CLS_TAB_LIST;
		tp.tabUl.classList.add('stile-link-target');
		tp.tabAs = [];
		const ios = document.body.classList.contains('ios');

		for (let i = 0; i < htmls.length; i += 1) {
			const li = document.createElement('li');
			const tc = document.createElement('a');
			tc.href = '#' + ID_TAB_LIST_ID_BASE + contIdx + '-' + i;
			tc.innerHTML = htmls[i];
			tc.dataset['stile'] = ios ? 'no-anchor-scroll' : 'anchor-scroll-fast';
			if (SINGLE_TAB) tc.addEventListener('click', () => { onTabClick(i, tabUls, tabUlss); });
			li.appendChild(tc);

			tp.tabUl.appendChild(li);
			tp.tabAs.push(tc);
		}
		NS.addStile(tp.tabUl.children[tabIdx], ST_STATE_CURRENT);
		if (SINGLE_TAB) NS.addStile(tp.tabUl, 'hidden');
		return tp;
	}

	function getFirstHeading(container) {
		const cs = container.children;
		for (let i = 0; i < cs.length; i += 1) {
			const tn = cs[i].tagName;
			if (tn[0] === 'H' && (tn[1] === '1' || tn[1] === '2' || tn[1] === '3' || tn[1] === '4' || tn[1] === '5' || tn[1] === '6')) {
				return cs[i];
			}
		}
		return null;
	}


	// -------------------------------------------------------------------------


	function initializeSingleTab(tabUlss) {
		updateVisibility(tabUlss, true);
		NS.onScroll(() => { updateVisibility(tabUlss); });
	}

	function onTabClick(idx, tabUls, tabUlss) {
		showImmediately(tabUls[idx]);
		setTimeout(() => { updateVisibility(tabUlss, true); }, 10);
	}

	function updateVisibility(tabUlss, immediately = false) {
		if (immediately) {
			for (let i = 0; i < tabUlss.length; i += 1) {
				const tabUls = tabUlss[i];
				for (let j = 0; j < tabUls.length; j += 1) {
					NS.addStile(tabUls[j], 'immediately');
				}
			}
		}
		for (let i = 0; i < tabUlss.length; i += 1) {
			const tabUls = tabUlss[i];
			let shown = false;
			for (let j = 0; j < tabUls.length; j += 1) {
				const tabUl = tabUls[j];
				const y = tabUl.getBoundingClientRect().top;
				if (0 < y && !shown) {
					shown = true;
					NS.removeStile(tabUl, 'hidden');
				} else if (shown) {
					NS.addStile(tabUl, 'hidden');
				}
			}
		}
		if (immediately) {
			setTimeout(() => {
				for (let i = 0; i < tabUlss.length; i += 1) {
					const tabUls = tabUlss[i];
					for (let j = 0; j < tabUls.length; j += 1) {
						NS.removeStile(tabUls[j], 'immediately');
					}
				}
			}, 1000);
		}
	}

	function showImmediately(tabUl) {
		NS.addStile(tabUl, 'immediately');
		NS.removeStile(tabUl, 'hidden');
		setTimeout(() => { NS.removeStile(tabUl, 'immediately'); }, 1000);
	}

})(window.ST);
