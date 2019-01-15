/**
 *
 * Pseudo Tab Page Classes (JS)
 *
 * @author Takuto Yanagida @ Space-Time Inc.
 * @version 2019-01-15
 *
 */


let ST = ST || {};


ST.addInitializer(3, function () {

	const SELECTOR_TARGET     = '.pseudo-tab-page';
	const CLS_TAB_LIST        = 'stile-pseudo-tab-page-tab-list';
	const ID_TAB_LIST_ID_BASE = '';
	const ST_STATE_CURRENT    = 'current';

	const tps = document.querySelectorAll(SELECTOR_TARGET);
	for (let i = 0; i < tps.length; i += 1) {
		createTabPage(tps[i], i);
	}

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
			if (ST.onClickAnchorLink) {
				for (let j = 0; j < tp.tabAs.length; j += 1) {
					tp.tabAs[j].addEventListener('click', ST.onClickAnchorLink);
				}
			}
		}
		if (ST.initializeAnchorOffset) ST.initializeAnchorOffset(tabUls);
	}

	function createTab(htmls, tabIdx, contIdx) {
		const tp = {};
		tp.tabUl = document.createElement('ul');
		tp.tabUl.id = ID_TAB_LIST_ID_BASE + contIdx + '-' + tabIdx;
		tp.tabUl.className = CLS_TAB_LIST;
		tp.tabUl.classList.add('stile-link-target');
		tp.tabAs = [];

		for (let i = 0; i < htmls.length; i += 1) {
			const li = document.createElement('li');
			const tc = document.createElement('a');
			tc.href = '#' + ID_TAB_LIST_ID_BASE + contIdx + '-' + i;
			tc.innerHTML = htmls[i];
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

});
