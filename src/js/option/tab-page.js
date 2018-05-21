/**
 *
 * Tab Page (JS)
 *
 * @author Takuto Yanagida @ Space-Time Inc.
 * @version 2018-05-21
 *
 */


document.addEventListener('DOMContentLoaded', function () {

	const SELECTOR_TARGET     = '.tab-page';
	const CLS_TAB_LIST        = 'stile-tab-page-tab-list';
	const STILE_STATE_CURRENT = 'current';

	const tabPages = [];
	const tps = document.querySelectorAll(SELECTOR_TARGET);
	for (var i = 0; i < tps.length; i += 1) {
		if (createTab(tps[i])) tabPages.push(tps[i]);
	}
	window.addEventListener('resize', function () {onResize(tabPages);});
	onResize(tabPages);

	function createTab(tabPage) {
		const fh = getFirstHeading(tabPage);
		if (!fh) return false;
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
		return true;
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
		for (let i = 0; i < tabs.length; i += 1) {
			if (i === idx) addDataStile(tabs[i], STILE_STATE_CURRENT);
			else removeDataStile(tabs[i], STILE_STATE_CURRENT);
		}
		for (let i = 0; i < pages.length; i += 1) {
			if (i === idx) addDataStile(pages[i], STILE_STATE_CURRENT);
			else removeDataStile(pages[i], STILE_STATE_CURRENT);
		}
	}

	function onResize(tabPages) {
		for (let i = 0; i < tabPages.length; i += 1) {
			const tabPage = tabPages[i];
			const tabRow = tabPage.getElementsByTagName('ul')[0];
			const pages = filterChild(tabPage, tabPage.querySelectorAll('div'));

			let margin = parseInt(getComputedStyle(tabRow).marginBottom);
			let height = 0;

			for (let j = 0; j < pages.length; j += 1) {
				const p = pages[j];
				margin = Math.max(margin, parseInt(getComputedStyle(p).marginTop));
				height = Math.max(height, p.getBoundingClientRect().height);
			}
			tabPage.style.minHeight = tabRow.offsetHeight + margin + height + 'px';
			tabPage.style.height = tabPage.style.minHeight;
		}
	}

	function addDataStile(elm, style) {
		if (elm.dataset.stile) {
			const ssl = ' ' + elm.dataset.stile + ' ';
			const sbb = ' ' + style + ' ';
			if (ssl.indexOf(sbb) !== -1) return;
			elm.dataset.stile = elm.dataset.stile + ' ' + style;
		} else {
			elm.dataset.stile = style;
		}
	}

	function removeDataStile(elm, style) {
		if (!elm.dataset.stile) return;
		const ssl = ' ' + elm.dataset.stile + ' ';
		const sbb = ' ' + style + ' ';
		elm.dataset.stile = (ssl.replace(sbb, ' ')).trim();
	}

});
