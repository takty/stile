/**
 *
 * Pseudo Tab Page Classes (JS)
 *
 * @author Takuto Yanagida @ Space-Time Inc.
 * @version 2019-06-07
 *
 */


window.ST = window['ST'] || {};


ST.addInitializer(3, function () {

	const SELECTOR_TARGET     = '.pseudo-tab-page';
	const CLS_TAB_LIST        = 'stile-pseudo-tab-page-tab-list';
	const ID_TAB_LIST_ID_BASE = '';
	const ST_STATE_CURRENT    = 'current';
	const SINGLE_TAB          = true;

	const tabUlss = [];
	const tps = document.querySelectorAll(SELECTOR_TARGET);
	for (let i = 0; i < tps.length; i += 1) {
		const tabUls = createTabPage(tps[i], i);
		if (tabUls !== false) tabUlss.push(tabUls);
	}
	if (SINGLE_TAB) initializeSingleTab();

	function createTabPage(container, idx) {
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
			const tp = createTab(htmls, i, idx, tabUls);
			container.insertBefore(tp.tabUl, hs[i]);
			tabUls.push(tp.tabUl);
		}
		if (ST.assignAnchorOffset) ST.assignAnchorOffset(tabUls);
		return tabUls;
	}

	function createTab(htmls, tabIdx, contIdx, tabUls) {
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
			if (SINGLE_TAB) tc.addEventListener('click', () => { onTabClick(i, tabUls); });
			li.appendChild(tc);

			tp.tabUl.appendChild(li);
			tp.tabAs.push(tc);
		}
		ST.addStile(tp.tabUl.children[tabIdx], ST_STATE_CURRENT);
		if (SINGLE_TAB) ST.addStile(tp.tabUl, 'hidden');
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


	function initializeSingleTab() {
		updateVisibility(tabUlss, true);
		ST.onScroll(() => { updateVisibility(tabUlss); });
	}

	function onTabClick(idx, tabUls) {
		showImmediately(tabUls[idx]);
		setTimeout(() => { updateVisibility(tabUlss, true); }, 10);
	}

	function updateVisibility(tabUlss, immediately = false) {
		if (immediately) {
			for (let i = 0; i < tabUlss.length; i += 1) {
				const tabUls = tabUlss[i];
				for (let j = 0; j < tabUls.length; j += 1) {
					ST.addStile(tabUls[j], 'immediately');
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
					ST.removeStile(tabUl, 'hidden');
				} else if (shown) {
					ST.addStile(tabUl, 'hidden');
				}
			}
		}
		if (immediately) {
			setTimeout(() => {
				for (let i = 0; i < tabUlss.length; i += 1) {
					const tabUls = tabUlss[i];
					for (let j = 0; j < tabUls.length; j += 1) {
						ST.removeStile(tabUls[j], 'immediately');
					}
				}
			}, 1000);
		}
	}

	function showImmediately(tabUl) {
		ST.addStile(tabUl, 'immediately');
		ST.removeStile(tabUl, 'hidden');
		setTimeout(() => { ST.removeStile(tabUl, 'immediately'); }, 1000);
	}

});
