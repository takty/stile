/**
 *
 * Tab Page Classes (JS)
 *
 * @author Takuto Yanagida @ Space-Time Inc.
 * @version 2018-06-22
 *
 */


let ST = ST || {};


document.addEventListener('DOMContentLoaded', function () {

	const SELECTOR_TARGET    = '.tab-page';
	const CLS_TAB_LIST       = 'stile-tab-page-tab-list';
	const CLS_TAB_LIST_BELOW = 'stile-tab-page-tab-list-below';
	const ST_STATE_CURRENT   = 'current';

	const PAGE_HEIGHT_WINDOW_HEIGHT_RATIO = 0.8;

	const tabPages = [];
	const tps = document.querySelectorAll(SELECTOR_TARGET);
	for (let i = 0; i < tps.length; i += 1) {
		const tabPage = createTabPage(tps[i]);
		if (tabPage) tabPages.push(tabPage);
	}
	window.addEventListener('resize', function () { onResize(tabPages); });
	onResize(tabPages);
	setTimeout(function () {onResize(tabPages)}, 200);  // Delay

	function createTabPage(container) {
		const fh = getFirstHeading(container);
		if (!fh) return false;
		const tabH = fh.tagName;

		const pages = [], htmls = [];
		const cs = [].slice.call(container.children);
		let curPage = null;

		for (let i = 0; i < cs.length; i += 1) {
			const c = cs[i];
			if (c.tagName === tabH) {
				if (curPage) pages.push(curPage);
				curPage = document.createElement('div');
				container.removeChild(c);
				htmls.push(c.innerHTML);
			} else {
				if (curPage) curPage.appendChild(c);
			}
		}
		if (curPage) pages.push(curPage);

		const tp = {pages, container, currentIdx: 0, isAccordion: false};
		createTab(htmls, tp);

		container.insertBefore(tp.tabUl, container.firstChild);
		for (let i = 0; i < pages.length; i += 1) container.appendChild(pages[i]);
		container.appendChild(tp.tabUl2);

		addTabEvent(tp);
		onTabClick(tp, 0);
		return tp;
	}

	function createTab(htmls, tp) {
		tp.tabUl = document.createElement('ul');
		for (let i = 0; i < htmls.length; i += 1) {
			const li = document.createElement('li');
			li.innerHTML = htmls[i];
			tp.tabUl.appendChild(li);
		}
		tp.tabUl.className = CLS_TAB_LIST;
		tp.tabs = [].slice.call(tp.tabUl.children);

		tp.tabUl2 = tp.tabUl.cloneNode(true);
		tp.tabUl2.className = CLS_TAB_LIST_BELOW;
		tp.tabs2 = [].slice.call(tp.tabUl2.children);
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

	function addTabEvent(tp) {
		const ts  = tp.tabs;
		const ts2 = tp.tabs2;
		for (let i = 0; i < ts.length; i += 1) {
			const f = (function (idx) {
				return function (e) {
					e.preventDefault();
					onTabClick(tp, idx);
					if (!tp.isAccordion) onResizeOne(tp);
				};
			})(i);
			ts[i].addEventListener('click', f);
			ts2[i].addEventListener('click', f);
		}
	}

	function onTabClick(tp, idx) {
		if (tp.isAccordion) {
			idx = tp.currentIdx === idx ? -1 : idx;
			updateAccordionTabState(tp, idx);
		}
		changeCurrentTab(tp, idx);
	}

	function changeCurrentTab(tp, idx) {
		const ts  = tp.tabs;
		const ps  = tp.pages;

		for (let i = 0; i < ts.length; i += 1) {
			if (i === idx) {
				ST.addStile(ts[i], ST_STATE_CURRENT);
				ST.addStile(ps[i], ST_STATE_CURRENT);
			} else {
				ST.removeStile(ts[i], ST_STATE_CURRENT);
				ST.removeStile(ps[i], ST_STATE_CURRENT);
			}
			ts[i].className = '';
			ps[i].className = '';
		}
		tp.currentIdx = idx;
	}

	function updateAccordionTabState(tp, idx) {
		const ts  = tp.tabs;
		const ts2 = tp.tabs2;
		if (idx === -1) {
			for (let i = 0; i < ts.length; i += 1) {
				ts[i].style.display  = '';
				ts2[i].style.display = 'none';
			}
		} else {
			for (let i = 0; i < ts.length; i += 1) {
				ts[i].style.display  = (i <= idx) ? '' : 'none';
				ts2[i].style.display = (i > idx)  ? '' : 'none';
			}
		}
	}

	function onResize(tps) {
		for (let i = 0; i < tps.length; i += 1) {
			onResizeOne(tps[i]);
		}
	}

	function onResizeOne(tp) {
		const cont = tp.container;
		const prevIsAccordion = tp.isAccordion;
		tp.isAccordion = getComputedStyle(tp.tabUl2).display !== 'none';

		if (tp.isAccordion) {
			cont.style.minHeight = '';
			cont.style.height    = '';
			if (prevIsAccordion !== tp.isAccordion) changeCurrentTab(tp, -1);
			updateAccordionTabState(tp, tp.currentIdx);
		} else {
			const tabs = tp.tabs;
			const minH = getMinHeight(tp);
			if (minH < window.innerHeight * PAGE_HEIGHT_WINDOW_HEIGHT_RATIO) {
				cont.style.minHeight = minH + 'px';
				cont.style.height    = minH + 'px';
			} else {
				cont.style.minHeight = '';
				cont.style.height    = '';
			}
			for (let i = 0; i < tabs.length; i += 1) tabs[i].style.display = '';
			if (tp.currentIdx === -1) tp.currentIdx = 0;
			onTabClick(tp, tp.currentIdx);
		}
	}

	function getMinHeight(tp) {
		const tabUl = tp.tabUl;
		const pages = tp.pages;

		let margin = parseInt(getComputedStyle(tabUl).marginBottom);
		let height = 0;

		for (let i = 0; i < pages.length; i += 1) {
			const p = pages[i];
			const m = parseInt(getComputedStyle(p).marginTop);
			const h = p.getBoundingClientRect().height;
			margin = Math.max(margin, m);
			height = Math.max(height, h);
		}
		return tabUl.offsetHeight + margin + height;
	}

});
