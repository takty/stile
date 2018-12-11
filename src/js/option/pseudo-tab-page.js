/**
 *
 * Pseudo Tab Page Classes (JS)
 *
 * @author Takuto Yanagida @ Space-Time Inc.
 * @version 2018-12-11
 *
 */


let ST = ST || {};


document.addEventListener('DOMContentLoaded', function () {

	const SELECTOR_TARGET  = '.pseudo-tab-page';
	const CLS_TAB_LIST     = 'stile-pseudo-tab-page-tab-list';
	const ST_STATE_CURRENT = 'current';

	const tabPages = [];
	const tps = document.querySelectorAll(SELECTOR_TARGET);
	for (let i = 0; i < tps.length; i += 1) {
		createTabPage(tps[i], i);
	}

	function createTabPage(container, idx) {
		const fh = getFirstHeading(container);
		if (!fh) return false;
		const tabH = fh.tagName;

		const pages = [], htmls = [];
		const cs = [].slice.call(container.children);
		const hs = [];

		for (let i = 0; i < cs.length; i += 1) {
			const c = cs[i];
			if (c.tagName === tabH) {
				hs.push(c);
				htmls.push(c.innerHTML);
			}
		}
		let hss = [].slice.call(hs);

		for (let i = 0; i < hss.length; i += 1) {
			const tp = {pages, container, currentIdx: i, isAccordion: false};
			createTab(htmls, tp, i, idx);
			container.insertBefore(tp.tabUl, hss[i]);
			container.removeChild(hss[i]);
			tabPages.push(tp);
		}
	}

	function createTab(htmls, tp, tabIdx, contIdx) {
		tp.tabUl = document.createElement('ul');
		tp.tabUl.id = 'stile-pseudo-tab-page-' + contIdx + '-' + tabIdx;
		for (let i = 0; i < htmls.length; i += 1) {
			const li = document.createElement('li');
			let tc;
			if (i === tabIdx) {
				tc = document.createElement('span');
			} else {
				tc = document.createElement('a');
				tc.href = '#stile-pseudo-tab-page-' + contIdx + '-' + i;
			}
			tc.innerHTML = htmls[i];
			li.appendChild(tc);
			tp.tabUl.appendChild(li);
		}
		tp.tabUl.className = CLS_TAB_LIST;
		tp.tabs = [].slice.call(tp.tabUl.children);

		ST.addStile(tp.tabs[tabIdx], ST_STATE_CURRENT);
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
