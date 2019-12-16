/**
 *
 * Tab Page Classes (JS)
 *
 * @author Takuto Yanagida @ Space-Time Inc.
 * @version 2019-12-16
 *
 */


window.ST = window['ST'] || {};


(function (NS) {

	const SELECTOR_TARGET    = '.tab-page';
	const CLS_TAB_LIST       = 'stile-tab-page-tab-list';
	const CLS_TAB_LIST_BELOW = 'stile-tab-page-tab-list-below';
	const ST_STATE_CURRENT   = 'current';

	const PAGE_WINDOW_HEIGHT_RATIO = 0.8;

	const HASH_PREFIX = 'tab:';

	NS.addInit(4, () => {
		const tabPages = [];
		const tps = document.querySelectorAll(SELECTOR_TARGET);
		for (let i = 0; i < tps.length; i += 1) {
			const tabPage = createTabPage(tps[i], i);
			tabPages.push(tabPage);
		}
		NS.onResize(() => { onResizeAll(tabPages); }, true);
		setTimeout(() => {  // Delay
			onResizeAll(tabPages);
			onHash(tabPages);
		}, 200);
		window.addEventListener('popstate', () => { onHash(tabPages); });
	});

	function createTabPage(container, contIdx) {
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

		const tp = { pages, container, currentIdx: 0, isAccordion: false, contIdx };
		createTab(htmls, tp);

		container.insertBefore(tp.tabUl, container.firstChild);
		for (let i = 0; i < pages.length; i += 1) container.appendChild(pages[i]);
		container.appendChild(tp.tabUl2);

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
		addTabEvent(tp);

		setTimeout(() => {
			tp.isAccordion = getComputedStyle(tp.tabUl2).flexDirection === 'column';
			update(tp, tp.isAccordion ? -1 : 0);
		}, 10);
	}

	function addTabEvent(tp) {
		const ts = tp.tabs, ts2 = tp.tabs2;

		for (let i = 0; i < ts.length; i += 1) {
			const f = (function (idx) { return (e) => { onClick(e, tp, idx); }; })(i);
			ts[i].addEventListener('click', f);
			ts2[i].addEventListener('click', f);
		}
	}

	function onHash(tps) {
		const [hCont, hPage] = extractIndexFromHash(window.location.hash);
		if (hCont === null) {
			for (let i = 0; i < tps.length; i += 1) {
				if (!tps[i]) continue;
				update(tps[i], tps[i].isAccordion ? -1 : 0);
			}
		} else {
			update(tps[hCont], hPage);
			scrollToTab(tps[hCont]);
		}
	}

	function onClick(e, tp, idx) {
		e.preventDefault();
		if (!tp.isAccordion && tp.currentIdx === idx) return;
		update(tp, idx);
		scrollToTab(tp);
		pushTabState(tp);
		if (!tp.isAccordion) resizeTab(tp, true);
	}

	function scrollToTab(tp) {
		if (tp.currentIdx === -1) return;
		setTimeout(() => {
			const bcr = tp.tabUl2.getBoundingClientRect();
			if (bcr.top < 0 || window.innerHeight < bcr.bottom) NS.jumpToElement(tp.tabUl, 200, false);
		}, 10);
	}


	// -------------------------------------------------------------------------


	function getFirstHeading(container) {
		const cs = container.children;
		for (let i = 0; i < cs.length; i += 1) {
			if (/^H[1-6]$/.test(cs[i].tagName)) return cs[i];
		}
		return null;
	}


	// -------------------------------------------------------------------------


	function extractIndexFromHash(hash) {
		if (hash.indexOf('#tab:') !== 0) return [null, null];
		const cp = hash.replace('#tab:', '').split('-');
		if (cp.length !== 2) return [null, null];
		return [parseInt(cp[0]) - 1, parseInt(cp[1]) - 1];
	}

	function pushTabState(tp) {
		const idx = tp.currentIdx;
		if (0 <= idx) {
			const hash = HASH_PREFIX + (tp.contIdx + 1) + '-' + (idx + 1);
			history.pushState(null, null, '#' + hash);
			window.location.hash = hash;
		} else if (!tp.isAccordion) {
			history.pushState(null, null, '');
			window.location.hash = '';
		}
	}


	// -------------------------------------------------------------------------


	function update(tp, idx) {
		if (tp.isAccordion) {
			idx = tp.currentIdx === idx ? -1 : idx;
			updateAccordion(tp, idx);
		}
		updateTab(tp, idx);
	}

	function updateAccordion(tp, idx) {
		const ts = tp.tabs, ts2 = tp.tabs2;

		if (idx === -1) {
			for (let i = 0; i < ts.length; i += 1) {
				ts[i].style.display  = '';
				ts2[i].style.display = 'none';
			}
		} else {
			for (let i = 0; i < ts.length; i += 1) {
				ts[i].style.display  = (i <= idx) ? '' : 'none';
				ts2[i].style.display = (i > idx)  ? 'flex' : 'none';
			}
		}
	}

	function updateTab(tp, idx) {
		const ts = tp.tabs, ts2 = tp.tabs2;
		const ps = tp.pages;

		for (let i = 0; i < ts.length; i += 1) {
			if (i === idx) {
				NS.addStile(ts[i],  ST_STATE_CURRENT);
				NS.addStile(ts2[i], ST_STATE_CURRENT);
				NS.addStile(ps[i],  ST_STATE_CURRENT);
			} else {
				NS.removeStile(ts[i],  ST_STATE_CURRENT);
				NS.removeStile(ts2[i], ST_STATE_CURRENT);
				NS.removeStile(ps[i],  ST_STATE_CURRENT);
			}
			ts[i].className  = '';
			ts2[i].className = '';
			ps[i].className  = '';
		}
		tp.currentIdx = idx;
	}


	// -------------------------------------------------------------------------


	function onResizeAll(tps) {
		for (let i = 0; i < tps.length; i += 1) {
			if (!tps[i]) continue;
			resizeOne(tps[i]);
		}
	}

	function resizeOne(tp) {
		const prevIsAccordion = tp.isAccordion;
		tp.isAccordion = getComputedStyle(tp.tabUl2).flexDirection === 'column';

		if (tp.isAccordion) {
			resizeAccordion(tp, prevIsAccordion);
		} else {
			resizeTab(tp);
		}
	}

	function resizeAccordion(tp, prevIsAccordion) {
		const cont = tp.container;
		cont.style.minHeight = '';
		cont.style.height    = '';
		if (prevIsAccordion !== tp.isAccordion) updateTab(tp, -1);
		updateAccordion(tp, tp.currentIdx);
	}

	function resizeTab(tp, suppressTabClick = false) {
		const cont = tp.container;
		const minH = getMinHeight(tp);

		const h = (minH < window.innerHeight * PAGE_WINDOW_HEIGHT_RATIO) ? (minH + 'px') : '';
		cont.style.minHeight = h;
		cont.style.height    = h;

		const ts = tp.tabs, ts2 = tp.tabs2;

		for (let i = 0; i < ts.length; i += 1) {
			ts[i].style.display  = '';
			ts2[i].style.display = '';
		}
		if (tp.currentIdx === -1) tp.currentIdx = 0;
		if (!suppressTabClick) update(tp, tp.currentIdx);
	}

	function getMinHeight(tp) {
		const tabUl  = tp.tabUl;
		const tabUl2 = tp.tabUl2;
		const pages  = tp.pages;

		let marginBtm = parseInt(getComputedStyle(tabUl).marginBottom);
		let marginTop = parseInt(getComputedStyle(tabUl2).marginTop);
		let height = 0;

		for (let i = 0; i < pages.length; i += 1) {
			const p  = pages[i];
			const ps = getComputedStyle(p);
			const mt = parseInt(ps.marginTop);
			const mb = parseInt(ps.marginBottom);
			const h  = p.getBoundingClientRect().height;

			marginBtm = Math.max(marginBtm, mt);
			marginTop = Math.max(marginTop, mb);
			height    = Math.max(height, h);
		}
		return tabUl.offsetHeight + tabUl2.offsetHeight + marginBtm + marginTop + height;
	}

})(window.ST);
