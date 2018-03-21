/**
 *
 * Tab Page (JS)
 *
 * @author Takuto Yanagida @ Space-Time Inc.
 * @version 2018-03-21
 *
 */


document.addEventListener('DOMContentLoaded', function () {

	const SELECTOR_TARGET   = '.tab-page';
	const CLS_TAB_LIST      = 'tab-page-tab-list';
	const CLS_STATE_CURRENT = 'current';

	const tabPages = document.querySelectorAll(SELECTOR_TARGET);
	for (var i = 0; i < tabPages.length; i += 1) createTab(tabPages[i]);

	window.addEventListener('resize', function () {onResize(tabPages);});
	onResize(tabPages);

	function createTab(tabPage) {
		const fh = getFirstHeading(tabPage);
		if (!fh) return;
		const tabH = fh.tagName;

		const pages = [], tabs = [];
		let curPage = null;

		const cs = [].slice.call(tabPage.children);

		for (let i = 0; i < cs.length; i += 1) {
			const c = cs[i];
			if (c.tagName === tabH) {
				if (curPage) pages.push(curPage);
				curPage = document.createElement('div');

				tabPage.removeChild(c);
				const li = document.createElement('li');
				li.innerHTML = c.innerHTML;
				tabs.push(li);

				li.addEventListener('click', (function (idx) {
					return function (e) {
						e.preventDefault();
						onTabClick(idx, tabs, pages);
					};
				})(tabs.length - 1));
			} else {
				if (curPage) curPage.appendChild(c);
			}
		}
		if (curPage) pages.push(curPage);

		const ul = document.createElement('ul');
		ul.className = CLS_TAB_LIST;
		for (let i = 0; i < tabs.length; i += 1) ul.appendChild(tabs[i]);
		tabPage.insertBefore(ul, tabPage.firstChild);

		for (let i = 0; i < pages.length; i += 1) tabPage.appendChild(pages[i]);

		onTabClick(0, tabs, pages);
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

	function filterChild(parent, nodeList) {
		return [].slice.call(nodeList).filter(function (x) {return x.parentNode === parent;});
	}

	function onTabClick(idx, tabs, pages) {
		for (var i = 0; i < tabs.length; i += 1) {
			if (i === idx) tabs[i].classList.add(CLS_STATE_CURRENT);
			else tabs[i].classList.remove(CLS_STATE_CURRENT);
		}
		for (var i = 0; i < pages.length; i += 1) {
			if (i === idx) pages[i].classList.add(CLS_STATE_CURRENT);
			else pages[i].classList.remove(CLS_STATE_CURRENT);
		}
	}

	function onResize(tabPages) {
		for (var i = 0; i < tabPages.length; i += 1) {
			const tabPage = tabPages[i];
			var tabRow = tabPage.getElementsByTagName('ul')[0];
			var pages = filterChild(tabPage, tabPage.querySelectorAll('div'));

			var margin = parseInt(getComputedStyle(tabRow).marginBottom);
			var height = 0;

			for (var i = 0; i < pages.length; i += 1) {
				var p = pages[i];
				margin = Math.max(margin, parseInt(getComputedStyle(p).marginTop));
				height = Math.max(height, p.getBoundingClientRect().height);
			}
			tabPage.style.minHeight = tabRow.clientHeight + margin + height + 'px';
		}
	}

});
