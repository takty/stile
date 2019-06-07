/**
 *
 * Table Style - Fixed Header (JS)
 *
 * @author Takuto Yanagida @ Space-Time Inc.
 * @version 2019-06-07
 *
 */


window.ST = window['ST'] || {};


(function (NS) {

	const CLS_STICKY_ELM     = 'st-sticky-header';
	const CLS_STICKY_ELM_TOP = 'st-sticky-header-top';
	const SEL_TARGET         = '.stile';

	const ST_HEADER_CONTAINER = 'fixed-table-header-container';
	const ST_HEADER_TABLE     = 'fixed-table-header-table';
	const ST_SCROLL_BAR       = 'fixed-table-scroll-bar';
	const ST_ENLARGER_BUTTON  = 'enlarger-button';
	const ST_STATE_ENLARGED   = 'table-enlarged';
	const ST_OPT_NO_ENLARGER  = 'no-enlarger';

	const HEAD_BOTTOM_SHADOW = '0px 0.5rem 0.5rem -0.5rem rgba(0, 0, 0, 0.5)';

	const HEADER_FLOATING_WINDOW_HEIGHT_RATIO = 0.9;
	const ENLARGER_WINDOW_WIDTH_RATIO = 0.9;

	const getTableHeaderOffset = NS.makeOffsetFunction(CLS_STICKY_ELM, CLS_STICKY_ELM_TOP);
	let scrollBarWidth;

	NS.addInitializer(5, () => {
		const tabs = document.querySelectorAll(SEL_TARGET + ' table:not([class])');
		setTimeout(() => { initialize(tabs); }, 0);  // Delay for IE11
	});


	// -------------------------------------------------------------------------


	function initialize(tabs) {
		scrollBarWidth = parseInt(getScrollBarWidth());
		const conts = [];

		for (let i = 0; i < tabs.length; i += 1) {
			const tab  = tabs[i];
			if (tab.style.height) tab.style.height = '';

			const head = cloneTableHeader(tab);
			const bar  = cloneTableScrollBar(tab);
			const etb  = NS.containStile(tab, ST_OPT_NO_ENLARGER) ? null : createEnlarger(tab);
			const caps = tab.getElementsByTagName('caption');
			const cap  = caps.length ? caps[0] : null;
			if ((NS.BROWSER === 'ie11' || NS.BROWSER === 'edge') && head && cap) {
				tab.insertBefore(cap, tab.firstChild);  // Replace the order of caption and header
			}
			const cont = { table: tab, header: head, headerHeight: 0, bar: bar, etb: etb, cap: cap };
			initEvents(cont);
			conts.push(cont);

			windowScroll(cont);
			tableScroll(cont);

			if (tab.scrollWidth - tab.offsetWidth <= 1 || tab.offsetWidth >= ENLARGER_WINDOW_WIDTH_RATIO * window.innerWidth) {
				etb.style.display = 'none';
			}
			cont.calcWidth = tab.offsetWidth;
		}

		NS.onScroll(() => { for (let i = 0; i < tabs.length; i += 1) windowScroll(conts[i]); });
		NS.onResize(() => { for (let i = 0; i < tabs.length; i += 1) windowResize(conts[i]); });
	}

	function initEvents(cont) {
		const tab = cont.table;
		let tableScrollChanged = false, barScrollChanged = false;
		tab.addEventListener('scroll', NS.throttle(() => {
			tableScroll(cont);
			if (tableScrollChanged) {
				tableScrollChanged = false;
			} else {
				cont.bar.scrollLeft = tab.scrollLeft;
				barScrollChanged = true;
			}
		}));
		cont.barScrollListener = NS.throttle(() => {
			if (barScrollChanged) {
				barScrollChanged = false;
			} else {
				tab.scrollLeft = cont.bar.scrollLeft;
				tableScrollChanged = true;
			}
		});
		initBarEvent(cont);
		if (cont.etb) initEnlargerEvent(cont);
	}

	function initBarEvent(cont) {
		cont.bar.addEventListener('scroll', cont.barScrollListener);
	}

	function cloneTableHeader(table) {
		let thead = table.tHead;
		if (!thead) {
			thead = createPseudoTableHeader(table);
			if (!thead) return null;
		}
		const cont = document.createElement('div');
		NS.addStile(cont, ST_HEADER_CONTAINER);
		cont.style.maxWidth = table.getBoundingClientRect().width + 'px';
		cont.style.display = 'none';
		cont.style.top = (getTableHeaderOffset() + NS.getWpAdminBarHeight()) + 'px';
		cont.style.marginTop = '0';  // for cancel 'stile-margin-basic'
		table.parentNode.appendChild(cont);

		const ptab = document.createElement('div');
		NS.addStile(ptab, ST_HEADER_TABLE);
		let w = thead.getBoundingClientRect().width;
		if (NS.BROWSER === 'ie11') w = Math.ceil(w);
		ptab.style.width = w + 'px';
		cont.appendChild(ptab);

		const clone = thead.cloneNode(true);
		ptab.appendChild(clone);

		const oTrs = thead.rows;
		const cTrs = clone.rows;
		for (let i = 0; i < oTrs.length; i += 1) {
			copyWidth(oTrs[i], cTrs[i], 'td');
			copyWidth(oTrs[i], cTrs[i], 'th');
		}
		function copyWidth(o, c, tag) {
			const os = o.getElementsByTagName(tag);
			const cs = c.getElementsByTagName(tag);
			for (let i = 0; i < os.length; i += 1) {
				cs[i].style.width = os[i].getBoundingClientRect().width + 'px';
			}
		}
		if (NS.containStile(table, ST_STATE_ENLARGED)) NS.addStile(cont, ST_STATE_ENLARGED);
		return cont;
	}

	function createPseudoTableHeader(table) {
		const tbody = table.tBodies[0];
		const trs = tbody.rows;
		if (trs.length === 0) return null;

		function containsOnlyTh(tr) {
			const tds = tr.getElementsByTagName('td');
			const ths = tr.getElementsByTagName('th');
			if (tds.length === 0 && ths.length > 0) return true;
			return false;
		}

		const trsH = [];
		for (let i = 0, I = trs.length; i < I; i += 1) {
			const tr = trs[i];
			if (!containsOnlyTh(tr)) break;
			trsH.push(tr);
		}
		if (trsH.length === 0) return null;

		const thead = table.createTHead();
		for (let i = 0; i < trsH.length; i += 1) {
			thead.appendChild(trsH[i]);
		}
		return thead;
	}

	function cloneTableScrollBar(table) {
		const tbody = table.tBodies[0];

		const bar = document.createElement('div');
		NS.addStile(bar, ST_SCROLL_BAR);
		bar.style.maxWidth = table.clientWidth + 'px';
		bar.style.display = 'none';
		const h = parseInt(getScrollBarWidth());
		if (0 < h) bar.style.height = (h + 2) + 'px';
		table.parentNode.appendChild(bar);

		const spacer = document.createElement('div');
		spacer.style.width = Math.ceil(tbody.clientWidth) + 'px';
		spacer.style.height = '1px';
		bar.appendChild(spacer);

		return bar;
	}

	function windowResize(cont) {
		const tab = cont.table, head = cont.header, bar = cont.bar;
		if (cont.etb && NS.containStile(tab, ST_STATE_ENLARGED)) windowResize_enlarger(tab);

		if (head) {
			if (head.parentNode) head.parentNode.removeChild(head);
			cont.header = cloneTableHeader(tab);
		}
		if (bar) {
			if (bar.parentNode) bar.parentNode.removeChild(bar);
			cont.bar = cloneTableScrollBar(tab);
			initBarEvent(cont);
		}
		cont.calcWidth = cont.table.offsetWidth;
		if (cont.header || cont.bar) windowScroll(cont);
		tableScroll(cont);
	}

	function windowScroll(cont) {
		if (cont.calcWidth !== cont.table.offsetWidth) {
			windowResize(cont);
		}
		const tab = cont.table, head = cont.header, bar = cont.bar, cap = cont.cap;
		const winY = window.pageYOffset;
		const tabTop = tab.getBoundingClientRect().top + winY, tabBottom = tabTop + tab.offsetHeight;
		const capH = cap ? cap.offsetHeight : 0;
		const offset = getTableHeaderOffset() + NS.getWpAdminBarHeight() - capH;
		const isInWin = tab.offsetHeight < HEADER_FLOATING_WINDOW_HEIGHT_RATIO * (window.innerHeight - offset);
		const tabLeft = (head || bar) ? (tab.getBoundingClientRect().left + 'px') : '';

		if (head) {
			if (isInWin) {
				head.style.display = 'none';
				if (cont.etb) switchEnlargerToTable(cont);
			} else if (winY + offset < tabTop || tabBottom - cont.headerHeight < winY + offset) {
				head.style.display = 'none';
				if (cont.etb) switchEnlargerToTable(cont);
			} else if (tabTop < winY + offset) {
				head.style.display = 'block';
				head.style.top = (getTableHeaderOffset() + NS.getWpAdminBarHeight()) + 'px';
				head.style.boxShadow = HEAD_BOTTOM_SHADOW;
				cont.headerHeight = head.getBoundingClientRect().height;
				if (cont.etb) switchEnlargerToFloatingHeader(cont);
			}
			head.style.left = tabLeft;
			head.scrollLeft = tab.scrollLeft;
		}
		if (bar) {
			if (isInWin) {
				bar.style.display = 'none';
			} else if (winY + window.innerHeight < tabTop || tabBottom < winY + window.innerHeight) {
				bar.style.display = 'none';
			} else if (tab.scrollWidth - tab.clientWidth > 1) {  // for avoiding needless scrolling
				bar.style.display = 'block';
			}
			bar.style.left = tabLeft;
			bar.scrollLeft = tab.scrollLeft;
		}
	}

	function tableScroll(cont) {
		const tab = cont.table, head = cont.header, cap = cont.cap;
		if (head) head.scrollLeft = tab.scrollLeft;
		if (tab.scrollWidth - tab.clientWidth > 2) {  // for avoiding needless scrolling
			const r = tab.scrollLeft / (tab.scrollWidth - tab.clientWidth);
			let rl = 0.15, rr = 0.15;
			if (r < 0.1) rl *= r / 0.1;
			if (0.9 < r) rr *= (1 - r) / 0.1;
			const shadow = '1.5rem 0 1.5rem -1rem rgba(0,0,0,' + rl + ') inset, -1.5rem 0 1.5rem -1rem rgba(0,0,0,' + rr + ') inset';
			tab.style.boxShadow = shadow;
			tab.style.overflowX = 'auto';
			if (head) head.style.boxShadow = shadow + ', ' + HEAD_BOTTOM_SHADOW;
			if (cap) cap.style.transform = 'translateX(' + tab.scrollLeft + 'px)';
		} else {
			tab.style.boxShadow = '';
			tab.style.overflowX = '';
			if (head) head.style.boxShadow = HEAD_BOTTOM_SHADOW;
			if (cap) cap.style.transform = null;
		}
		if (cont.etb) tableScroll_enlarger_wrap(cont);
	}


	// Enlarger ----------------------------------------------------------------


	function createEnlarger(table) {
		const etb = document.createElement('div');
		etb.dataset['stile'] = ST_ENLARGER_BUTTON;
		table.appendChild(etb);
		return etb;
	}

	function initEnlargerEvent(cont) {
		cont.etb.addEventListener('click', () => { enlarge(cont); });
	}

	function switchEnlargerToTable(cont) {
		cont.etb.parentNode.removeChild(cont.etb);
		cont.etb.style.top = cont.cap ? (cont.cap.offsetHeight + 'px') : 0;
		cont.table.appendChild(cont.etb);
	}

	function switchEnlargerToFloatingHeader(cont) {
		cont.etb.parentNode.removeChild(cont.etb);
		cont.etb.style.top = 0;
		cont.header.appendChild(cont.etb);
	}

	function enlarge(cont) {
		const tab = cont.table;
		if (NS.containStile(tab, ST_STATE_ENLARGED)) {
			tab.style.marginLeft = '';
			tab.style.zIndex = '';
			tab.style.width = '';
			tab.style.maxWidth = '';
			NS.removeStile(tab, ST_STATE_ENLARGED);
		} else {
			if (tab.scrollWidth - tab.offsetWidth <= 1) return;
			tab.style.zIndex = '98';
			tab.style.width = 'calc(100vw - ' + scrollBarWidth + 'px)';
			tab.style.maxWidth = '100vw';
			tab.scrollLeft = 0;
			NS.addStile(tab, ST_STATE_ENLARGED);
		}
		windowResize(cont);
	}

	function windowResize_enlarger(tab) {
		let left = tab.getBoundingClientRect().left + window.pageXOffset;
		const tbody = tab.tBodies[0];
		const width = tbody.clientWidth, pwidth = window.innerWidth - scrollBarWidth;

		if (width < pwidth) left -= (pwidth - width) / 2;
		tab.style.marginLeft = -left + 'px';
	}

	function tableScroll_enlarger_wrap(cont) {
		const etb = cont.etb;
		NS.removeStile(etb, 'visible');
		if (cont.tse) clearTimeout(cont.tse);
		cont.tse = setTimeout(() => {
			NS.addStile(etb, 'visible');
		}, 200);
		tableScroll_enlarger(cont);
	}

	function tableScroll_enlarger(cont) {
		const tab = cont.table, etb = cont.etb, cap = cont.cap;
		const bodyW = tab.tBodies[0].clientWidth;
		if (tab.scrollWidth - tab.offsetWidth > 1 && tab.offsetWidth < ENLARGER_WINDOW_WIDTH_RATIO * window.innerWidth) {  // for avoiding needless scrolling
			const pos = Math.min(bodyW - tab.offsetWidth, tab.scrollLeft);  // for Mobile Safari
			etb.style.right = (-pos) + 'px';
			if (etb.parentNode === tab) etb.style.top = cap ? (cap.offsetHeight + 'px') : 0;
			etb.style.display = 'block';
		} else {
			if (NS.containStile(tab, ST_STATE_ENLARGED)) {
				const diff = etb.parentElement.offsetWidth - bodyW;
				if (0 < diff) {
					etb.style.right = diff + 'px';
				} else {
					const pos = Math.min(bodyW - tab.offsetWidth, tab.scrollLeft);  // for Mobile Safari
					etb.style.right = (-pos) + 'px';
				}
				if (etb.parentNode === tab) etb.style.top = cap ? (cap.offsetHeight + 'px') : 0;
				etb.style.display = 'block';
			} else {
				etb.style.display = 'none';
			}
		}
	}


	// Utilities ---------------------------------------------------------------


	function getScrollBarWidth() {
		const dummy = document.createElement('div');
		dummy.style.bottom = '100%';
		dummy.style.height = '1px';
		dummy.style.position = 'absolute';
		dummy.style.width = 'calc(100vw - 100%)';
		document.body.appendChild(dummy);
		let width = 0 | window.getComputedStyle(dummy, '').getPropertyValue('width');

		if (width === 0) {  // Window does not have any scroll bar
			dummy.style.overflowY = 'scroll';
			dummy.style.width = '';
			const c = document.createElement('div');
			c.style.minHeight = '100px';
			dummy.appendChild(c);
			const cw = 0 | window.getComputedStyle(c, '').getPropertyValue('width');
			width = dummy.offsetWidth - cw;
		}
		document.body.removeChild(dummy);
		return width;
	}

})(window.ST);
