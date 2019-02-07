/**
 *
 * Pseudo Tab Page Classes (JS)
 *
 * @author Takuto Yanagida @ Space-Time Inc.
 * @version 2019-02-07
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
			const tp = createTab(htmls, i, idx);
			container.insertBefore(tp.tabUl, hs[i]);
			tabUls.push(tp.tabUl);
		}
		if (ST.initializeAnchorOffset) ST.initializeAnchorOffset(tabUls);
		return tabUls;
	}

	function createTab(htmls, tabIdx, contIdx) {
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
			if (SINGLE_TAB) tc.addEventListener('click', onTabClick);
			li.appendChild(tc);

			tp.tabUl.appendChild(li);
			tp.tabAs.push(tc);
		}
		ST.addStile(tp.tabUl.children[tabIdx], ST_STATE_CURRENT);
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


	let stopUpdateVisibility = false;

	function initializeSingleTab() {
		updateVisibility(tabUlss);
		let st = null;
		window.addEventListener('scroll', () => {
			if (st) clearTimeout(st);
			st = setTimeout(() => { updateVisibility(tabUlss); }, 10);
		});
	}

	function onTabClick() {
		stopUpdateVisibility = true;
		showAll(tabUlss);
		setTimeout(() => {
			stopUpdateVisibility = false;
			updateVisibility(tabUlss);
		}, 10);
	}

	function updateVisibility(tabUlss) {
		if (stopUpdateVisibility) return;
		for (let i = 0; i < tabUlss.length; i += 1) {
			const tabUls = tabUlss[i];
			let shown = false;
			for (let j = 0; j < tabUls.length; j += 1) {
				const tabUl = tabUls[j];
				const y = tabUl.getBoundingClientRect().top;

				if (0 < y && !shown) {
					shown = true;
					tabUl.style.maxHeight = '';
					continue;
				}
				if (shown) {
					tabUl.style.maxHeight = '0';
					tabUl.style.overflow = 'hidden';
				}
			}
		}
	}

	function showAll(tabUlss) {
		for (let i = 0; i < tabUlss.length; i += 1) {
			const tabUls = tabUlss[i];
			for (let j = 0; j < tabUls.length; j += 1) {
				const tabUl = tabUls[j];
				tabUl.style.maxHeight = '';
			}
		}
	}

});
