/**
 *
 * Tab Page Classes (JS)
 *
 * @author Takuto Yanagida @ Space-Time Inc.
 * @version 2018-05-31
 *
 */


let ST = ST || {};


document.addEventListener('DOMContentLoaded', function () {

	const SELECTOR_TARGET          = '.tab-page';
	const CLS_TAB_LIST             = 'stile-tab-page-tab-list';
	const CLS_TAB_LIST_SECOND      = 'low';
	// const SELECTOR_TAB_LIST_SECOND = '.stile-tab-page-tab-list.low';
	const ST_STATE_CURRENT         = 'current';

	// let isAccordion = false;
	// let currentIdx = 0;

	const tabPages = [];
	const tps = document.querySelectorAll(SELECTOR_TARGET);
	for (let i = 0; i < tps.length; i += 1) {
		const tabPage = createTab(tps[i]);
		if (tabPage) {
			addTabEvent(tabPage);
			tabPages.push(tabPage);
			onTabClick(0, tabPage);
		}
	}
	window.addEventListener('resize', function () {
		for (let i = 0; i < tabPages.length; i += 1) onResize(tabPages[i]);
	});
	for (let i = 0; i < tabPages.length; i += 1) onResize(tabPages[i]);

	function createTab(container) {
		const fh = getFirstHeading(container);
		if (!fh) return false;
		const tabH = fh.tagName;

		const pages = [], tabs = [];
		let curPage = null;
		let tabUl, tabUl2;

		const cs = [].slice.call(container.children);

		for (let i = 0; i < cs.length; i += 1) {
			const c = cs[i];
			if (c.tagName === tabH) {
				if (curPage) pages.push(curPage);
				curPage = document.createElement('div');

				container.removeChild(c);
				const li = document.createElement('li');
				li.innerHTML = c.innerHTML;
				tabs.push(li);
			} else {
				if (curPage) curPage.appendChild(c);
			}
		}
		if (curPage) pages.push(curPage);

		tabUl = document.createElement('ul');
		tabUl.className = CLS_TAB_LIST;
		for (let i = 0; i < tabs.length; i += 1) tabUl.appendChild(tabs[i]);

		tabUl2 = tabUl.cloneNode(true);
		tabUl2.classList.add(CLS_TAB_LIST_SECOND);
		const tabs2 = [].slice.call(tabUl2.children);

		container.insertBefore(tabUl, container.firstChild);
		for (let i = 0; i < pages.length; i += 1) container.appendChild(pages[i]);
		container.appendChild(tabUl2);
		return {tabs, tabs2, pages, container, currentIdx: 0};
	}

	function addTabEvent(tabPage) {
		// console.log(tabPage);
		for (let i = 0; i < tabPage.tabs.length; i += 1) {
			const f = (function (idx) {
				return function (e) {
					e.preventDefault();
					onTabClick(idx, tabPage);
				};
			})(i);
			tabPage.tabs[i].addEventListener('click', f);
			tabPage.tabs2[i].addEventListener('click', f);
		}
	}

	function getFirstHeading(page) {
		const cs = page.children;
		for (let i = 0; i < cs.length; i += 1) {
			const tn = cs[i].tagName;
			if (tn[0] === 'H' && (tn[1] === '1' || tn[1] === '2' || tn[1] === '3' || tn[1] === '4' || tn[1] === '5' || tn[1] === '6')) {
				return cs[i];
			}
		}
		return null;
	}

	// function filterChild(parent, nodeList) {
	// 	return [].slice.call(nodeList).filter(function (x) {return x.parentNode === parent;});
	// }

	function onTabClick(idx, tabPage) {
		const tabs = tabPage.tabs;
		const tabs2 = tabPage.tabs2;
		const pages = tabPage.pages;
		if (tabPage.isAccordion) {
			const visibleIdx = tabPage.currentIdx === idx ? -1 : idx;
			if (visibleIdx === -1) {
				for (let i = 0; i < tabs.length; i += 1) {
					tabs[i].style.display = '';
					tabs2[i].style.display = 'none';
				}
			} else {
				for (let i = 0; i < tabs.length; i += 1) {
					tabs[i].style.display = (i <= idx) ? '' : 'none';
					tabs2[i].style.display = (i > idx) ? '' : 'none';
				}
			}
			for (let i = 0; i < tabs.length; i += 1) {
				if (i === visibleIdx) ST.addStile(tabs[i], ST_STATE_CURRENT);
				else ST.removeStile(tabs[i], ST_STATE_CURRENT);
				tabs[i].className = '';
			}
			for (let i = 0; i < pages.length; i += 1) {
				if (i === visibleIdx) ST.addStile(pages[i], ST_STATE_CURRENT);
				else ST.removeStile(pages[i], ST_STATE_CURRENT);
				pages[i].className = '';
			}
			tabPage.currentIdx = visibleIdx;
		} else {
			for (let i = 0; i < tabs.length; i += 1) {
				if (i === idx) ST.addStile(tabs[i], ST_STATE_CURRENT);
				else ST.removeStile(tabs[i], ST_STATE_CURRENT);
				tabs[i].className = '';
			}
			for (let i = 0; i < pages.length; i += 1) {
				if (i === idx) ST.addStile(pages[i], ST_STATE_CURRENT);
				else ST.removeStile(pages[i], ST_STATE_CURRENT);
				pages[i].className = '';
			}
			tabPage.currentIdx = idx;
		}
	}

	function onResize(tabPage) {
		tabPage.isAccordion = getComputedStyle(tabPage.tabs2[0].parentNode).display !== 'none';

		const tabs = tabPage.tabs;
		const tabs2 = tabPage.tabs2;
		// const pages = tabPage.pages;

		if (tabPage.isAccordion) {
			tabPage.container.style.minHeight = 'initial';
			tabPage.container.style.height = 'initial';
			for (let i = 0; i < tabs.length; i += 1) {
				tabs[i].style.display = (i <= tabPage.currentIdx) ? '' : 'none';
				tabs2[i].style.display = (i > tabPage.currentIdx) ? '' : 'none';
			}
		} else {
			if (tabPage.currentIdx === -1) tabPage.currentIdx = 0;
			const tabRow = tabPage.container.getElementsByTagName('ul')[0];
			const pages = tabPage.pages;//filterChild(tabPage, tabPage.querySelectorAll('div'));

			let margin = parseInt(getComputedStyle(tabRow).marginBottom);
			let height = 0;

			for (let j = 0; j < pages.length; j += 1) {
				const p = pages[j];
				margin = Math.max(margin, parseInt(getComputedStyle(p).marginTop));
				height = Math.max(height, p.getBoundingClientRect().height);
			}
			tabPage.container.style.minHeight = tabRow.offsetHeight + margin + height + 'px';
			tabPage.container.style.height = tabPage.container.style.minHeight;

			for (let i = 0; i < tabs.length; i += 1) {
				tabs[i].style.display = '';
			}
			onTabClick(tabPage.currentIdx, tabPage);
		}
	}

});
