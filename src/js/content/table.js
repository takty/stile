/**
 *
 * Table Style (JS)
 *
 * @author Takuto Yanagida @ Space-Time Inc.
 * @version 2018-06-27
 *
 */


let ST = ST || {};


document.addEventListener('DOMContentLoaded', function () {

	const CLS_STICKY_ELM     = 'st-sticky-header';
	const CLS_STICKY_ELM_TOP = 'st-sticky-header-top';
	const TARGET_SELECTOR    = '.stile';

	const ST_HEADER_CONTAINER = 'fixed-table-header-container';
	const ST_HEADER_TABLE     = 'fixed-table-header-table';
	const ST_SCROLL_BAR       = 'fixed-table-scroll-bar';
	const ST_ENLARGER_BUTTON  = 'enlarger-button';
	const ST_STATE_ENLARGED   = 'table-enlarged';

	const ST_OPT_NO_NEAT_WRAP = 'no-neat-wrap';
	const ST_OPT_NO_ENLARGER  = 'no-enlarger';

	const CELL_MIN_WIDTH = 120;
	const CELL_MIN_RATIO = 2 / 3;  // width : height
	const HEAD_BOTTOM_SHADOW = '0px 0.5rem 0.5rem -0.5rem rgba(0, 0, 0, 0.5)';

	const HEADER_FLOATING_WINDOW_HEIGHT_RATIO = 0.9;
	const ENLARGER_WINDOW_WIDTH_RATIO = 0.9;

	const getTableHeaderOffset = ST.makeOffsetFunction(CLS_STICKY_ELM, CLS_STICKY_ELM_TOP);
	const tabs = document.querySelectorAll(TARGET_SELECTOR + ' table:not([class])');
	let scrollBarWidth;
	setTimeout(function () { init(tabs); }, 100);  // Delay for Chrome and Edge

	function init(tabs) {
		for (let i = 0; i < tabs.length; i += 1) {
			if (!ST.containStile(tabs[i], ST_OPT_NO_NEAT_WRAP)) addWrapStyle(tabs[i]);
		}
		setTimeout(function () { initFixedHeaderTable(tabs); }, 0);  // Delay for IE11
	}

	function initFixedHeaderTable(tabs) {
		scrollBarWidth = parseInt(getScrollBarWidth());
		const conts = [];

		for (let i = 0; i < tabs.length; i += 1) {
			const tab  = tabs[i];
			if (tab.style.height) tab.style.height = '';

			const head = cloneTableHeader(tab);
			const bar  = cloneTableScrollBar(tab);
			const etb  = ST.containStile(tab, ST_OPT_NO_ENLARGER) ? null : createEnlarger(tab);
			const cont = {table: tab, header: head, headerHeight: 0, bar: bar, etb: etb};
			initEvents(cont);
			conts.push(cont);

			windowScroll(cont);
			tableScroll(cont);

			if (tab.scrollWidth - tab.offsetWidth <= 1 || tab.offsetWidth >= ENLARGER_WINDOW_WIDTH_RATIO * window.innerWidth) {
				etb.style.display = 'none';
			}
			cont.calcWidth = tab.offsetWidth;
		}

		let scrollSt = null, resizeSt = null;
		window.addEventListener('scroll', function () {
			if (scrollSt) clearTimeout(scrollSt);
			scrollSt = setTimeout(function() {
				for (let i = 0; i < tabs.length; i += 1) windowScroll(conts[i]);
				scrollSt = null;
			}, 10);
		});
		window.addEventListener('resize', function () {
			if (resizeSt) clearTimeout(resizeSt);
			resizeSt = setTimeout(function() {
				for (let i = 0; i < tabs.length; i += 1) windowResize(conts[i]);
				resizeSt = null;
			}, 10);
		});
	}

	function initEvents(cont) {
		const tab = cont.table;
		let tableScrollChanged = false, barScrollChanged = false;
		tab.addEventListener('scroll', function () {
			tableScroll(cont);
			if (tableScrollChanged) {
				tableScrollChanged = false;
			} else {
				cont.bar.scrollLeft = tab.scrollLeft;
				barScrollChanged = true;
			}
		});
		cont.barScrollListener = function () {
			if (barScrollChanged) {
				barScrollChanged = false;
			} else {
				tab.scrollLeft = cont.bar.scrollLeft;
				tableScrollChanged = true;
			}
		};
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
		ST.addStile(cont, ST_HEADER_CONTAINER);
		cont.style.maxWidth = table.getBoundingClientRect().width + 'px';
		cont.style.display = 'none';
		cont.style.top = (getTableHeaderOffset() + ST.getWpAdminBarHeight()) + 'px';
		cont.style.marginTop = '0';  // for cancel 'stile-margin-basic'
		table.parentNode.appendChild(cont);

		const ptab = document.createElement('div');
		ST.addStile(ptab, ST_HEADER_TABLE);
		let w = thead.getBoundingClientRect().width;
		if (ST.BROWSER === 'ie11') w = Math.ceil(w);
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
		if (ST.containStile(table, ST_STATE_ENLARGED)) ST.addStile(cont, ST_STATE_ENLARGED);
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
		ST.addStile(bar, ST_SCROLL_BAR);
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
		if (cont.etb && ST.containStile(tab, ST_STATE_ENLARGED)) windowResize_enlarger(tab);

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
		const tab = cont.table, head = cont.header, bar = cont.bar;
		const winX = window.scrollX | window.pageXOffset, winY = window.scrollY | window.pageYOffset;
		const tabTop = ST.elementTopOnWindow(tab), tabBottom = tabTop + tab.offsetHeight;
		const offset = getTableHeaderOffset() + ST.getWpAdminBarHeight();
		const isInWin = tab.offsetHeight < HEADER_FLOATING_WINDOW_HEIGHT_RATIO * (window.innerHeight - offset);
		const tabLeft = (head || bar) ? ((ST.elementLeftOnWindow(tab) - winX) + 'px') : '';

		if (head) {
			if (isInWin) {
				head.style.display = 'none';
				if (cont.etb) switchEnlargerToTable(cont);
			} else if (winY + offset < tabTop || tabBottom - cont.headerHeight < winY + offset) {
				head.style.display = 'none';
				if (cont.etb) switchEnlargerToTable(cont);
			} else if (tabTop < winY + offset) {
				head.style.display = 'block';
				head.style.top = (getTableHeaderOffset() + ST.getWpAdminBarHeight()) + 'px';
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
		const tab = cont.table, head = cont.header;
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
		} else {
			tab.style.boxShadow = '';
			tab.style.overflowX = '';
			if (head) head.style.boxShadow = HEAD_BOTTOM_SHADOW;
		}
		if (cont.etb) tableScroll_enlarger_wrap(cont);
	}


	// -------------------------------------------------------------------------
	// Enlarger

	function createEnlarger(table) {
		const etb = document.createElement('div');
		etb.dataset['stile'] = ST_ENLARGER_BUTTON;
		table.appendChild(etb);
		return etb;
	}

	function initEnlargerEvent(cont) {
		cont.etb.addEventListener('click', function () {enlarge(cont);});
	}

	function switchEnlargerToTable(cont) {
		cont.etb.parentNode.removeChild(cont.etb);
		cont.table.appendChild(cont.etb);
	}

	function switchEnlargerToFloatingHeader(cont) {
		cont.etb.parentNode.removeChild(cont.etb);
		cont.header.appendChild(cont.etb);
	}

	function enlarge(cont) {
		const tab = cont.table;
		if (ST.containStile(tab, ST_STATE_ENLARGED)) {
			tab.style.marginLeft = '';
			tab.style.zIndex = '';
			tab.style.width = '';
			tab.style.maxWidth = '';
			ST.removeStile(tab, ST_STATE_ENLARGED);
		} else {
			if (tab.scrollWidth - tab.offsetWidth <= 1) return;
			tab.style.zIndex = '98';
			tab.style.width = 'calc(100vw - ' + scrollBarWidth + 'px)';
			tab.style.maxWidth = '100vw';
			tab.scrollLeft = 0;
			ST.addStile(tab, ST_STATE_ENLARGED);
		}
		windowResize(cont);
	}

	function windowResize_enlarger(tab) {
		let left = ST.elementLeftOnWindow(tab);
		const tbody = tab.tBodies[0];
		const width = tbody.clientWidth, pwidth = window.innerWidth - scrollBarWidth;

		if (width < pwidth) left -= (pwidth - width) / 2;
		tab.style.marginLeft = -left + 'px';
	}

	let tse = null;

	function tableScroll_enlarger_wrap(cont) {
		if (ST.BROWSER === 'chrome' || ST.BROWSER === 'edge') {
			if (tse) clearTimeout(tse);
			tse = setTimeout(function () {tableScroll_enlarger(cont);}, 0);  // for updating enlager button position
		} else {
			tableScroll_enlarger(cont);
		}
	}

	function tableScroll_enlarger(cont) {
		const tab = cont.table, etb = cont.etb;
		if (tab.scrollWidth - tab.offsetWidth > 1 && tab.offsetWidth < ENLARGER_WINDOW_WIDTH_RATIO * window.innerWidth) {  // for avoiding needless scrolling
			etb.style.right = (-tab.scrollLeft) + 'px';
			etb.style.display = 'block';
		} else {
			if (ST.containStile(tab, ST_STATE_ENLARGED)) {
				const pw = etb.parentElement.offsetWidth;
				const diff = pw - tab.tBodies[0].clientWidth;
				if (0 < diff) {
					etb.style.right = diff + 'px';
				} else {
					etb.style.right = (-tab.scrollLeft) + 'px';
				}
				etb.style.display = 'block';
			} else {
				etb.style.display = 'none';
			}
		}
	}


	// -------------------------------------------------------------------------
	// Neat Wrap

	function addWrapStyle(table) {
		if (table.getAttribute('width') != null) table.setAttribute('width', '');
		table.style.maxWidth = '';

		const tbody = table.tBodies[0];
		if (tbody.clientWidth <= table.clientWidth) return;

		const tab = makeCellGrid(table);
		if (tab.length === 0) return;

		const repTd = table.getElementsByTagName('td')[0];
		const style = getComputedStyle(repTd);
		const padH = parseFloat(style.paddingLeft) + parseFloat(style.paddingRight);
		const padV = parseFloat(style.paddingTop) + parseFloat(style.paddingBottom);
		const lineHeight = parseFloat(style.lineHeight);

		const newWs = [];
		for (let x = 0; x < tab[0].length; x += 1) newWs.push(false);

		if (isIE11orOldEdge()) {
			calcNewWidthes_simply(table, tab, newWs, padH, padV, lineHeight, table.clientWidth);
		} else {
			calcNewWidthes(table, tab, newWs, padH, padV, lineHeight, table.clientWidth);
		}

		for (let y = 0; y < tab.length; y += 1) {
			const tabRow = tab[y];
			for (let x = 0; x < tabRow.length; x += 1) {
				const td = tabRow[x], newW = newWs[x];
				if (td === undefined || td === null || typeof td === 'number' || newW === false) continue;
				td.style.whiteSpace = 'normal';
				td.style.minWidth = newW + 'px';
				td.style.width = '';
			}
		}
	}

	function isIE11orOldEdge() {
		if (ST.BROWSER === 'ie11') return true;
		if (getEdgeRev() < 16) return true;  // Before Fall Creators Update
		return false;

		function getEdgeRev() {
			const ua = window.navigator.userAgent.toLowerCase();
			const ss = ua.split(' ');
			for (let i = 0; i < ss.length; i += 1) {
				if (ss[i].indexOf('edge') === 0) {
					return parseFloat(ss[i].split('/')[1]);
				}
			}
			return Number.MAX_VALUE;
		}
	}

	function calcNewWidthes_simply(table, tab, newWs, padH, padV, lineHeight, origTableWidth) {
		const origWs = [].concat(newWs);
		for (let y = 0; y < tab.length; y += 1) {
			const tabRow = tab[y];

			for (let x = 0; x < tabRow.length; x += 1) {
				if (newWs[x] !== false) continue;

				const td = tabRow[x];
				if (td === null || typeof td === 'number') continue;
				if (x < tabRow.length - 1 && typeof tabRow[x + 1] === 'number') continue;

				const aw = td.clientWidth - padH;
				const l = td.getElementsByTagName('br').length + 1;
				origWs[x] = aw;

				let minW = 0;
				for (let i = 2;; i += 1) {
					const tempW = aw / i + padH;
					const tempH = l * (i * lineHeight) + padV;
					if (tempW < CELL_MIN_WIDTH || tempW / tempH < CELL_MIN_RATIO) break;
					minW = tempW;
				}
				if (minW) newWs[x] = Math.max(newWs[x], minW);
			}
		}
		widenTableWidth_simply(newWs, origTableWidth, origWs);
	}

	function widenTableWidth_simply(newWs, widthOrig, origWs) {
		let widthNew = 0;
		for (let i = 0; i < newWs.length; i += 1) {
			if (newWs[i] === false) return;
			widthNew += newWs[i];
		}
		if (widthNew >= widthOrig) return;

		const keepAws = [];
		for (let i = 0; i < newWs.length; i += 1) {
			const rw = newWs[i] / widthNew * widthOrig;
			keepAws.push(origWs[i] < rw);
		}
		for (let i = 0; i < newWs.length; i += 1) {
			if (keepAws[i]) {
				widthNew  -= newWs[i];
				widthOrig -= origWs[i];

				newWs[i] = origWs[i];
			}
		}
		for (let i = 0; i < newWs.length; i += 1) {
			if (!keepAws[i]) {
				newWs[i] = newWs[i] / widthNew * widthOrig;
			}
		}
	}

	function calcNewWidthes(table, tab, newWs, padH, padV, lineHeight, origTableWidth) {
		const dummy = document.createElement('td');
		dummy.style.display = 'inline-block';
		dummy.style.position = 'fixed';
		dummy.style.visibility = 'hidden';
		table.appendChild(dummy);
		const wrapped = [];

		for (let y = 0; y < tab.length; y += 1) {
			const tabRow = tab[y];

			for (let x = 0; x < tabRow.length; x += 1) {
				wrapped[x] = false;
				const td = tabRow[x];
				if (td === undefined || td === null || typeof td === 'number') continue;
				if (x < tabRow.length - 1 && typeof tabRow[x + 1] === 'number') continue;

				td.innerHTML = td.innerHTML.trim();  // trim!!
				dummy.innerHTML = td.innerHTML + 'm';  // for adding error factor
				const aw = dummy.clientWidth - padH;
				const l = Math.round((dummy.clientHeight - padV) / lineHeight);

				let minW = 0;
				for (let i = 1;; i += 1) {
					const tempW = aw / i + padH;
					const tempH = l * (i * lineHeight) + padV;
					if (tempW < CELL_MIN_WIDTH || tempW / tempH < CELL_MIN_RATIO) break;
					if (1 < i) wrapped[x] = true;
					minW = tempW;
				}
				if (minW) newWs[x] = Math.max(newWs[x], minW);
			}
		}
		table.removeChild(dummy);
		widenTableWidth(newWs, wrapped, origTableWidth);
	}

	function widenTableWidth(newWs, wrapped, widthOrig) {
		let widthNew = 0, widthFix = 0;
		for (let i = 0; i < newWs.length; i += 1) {
			if (newWs[i] === false) return;
			if (wrapped[i]) {
				widthNew += newWs[i];
			} else {
				widthFix += newWs[i];
			}
		}
		if (widthNew + widthFix < widthOrig) {
			for (let i = 0; i < newWs.length; i += 1) {
				if (wrapped[i]) {
					newWs[i] = newWs[i] / widthNew * (widthOrig - widthFix);
				}
			}
		}
	}

	function makeCellGrid(table) {
		const thead = table.tHead;
		const tbody = table.tBodies[0];
		const tfoot = table.tFoot;

		const cells = [];
		if (thead) addCells(thead.rows, cells);
		if (tbody) addCells(tbody.rows, cells);
		if (tfoot) addCells(tfoot.rows, cells);

		let maxWidth = 0, tab = [];
		for (let i = 0; i < cells.length; i += 1) {
			const w = cells[i].length;
			if (maxWidth < w) maxWidth = w;
		}
		for (let i = 0; i < cells.length; i += 1) {
			const a = [];
			a.length = maxWidth;
			tab.push(a);
		}

		for (let y = 0; y < tab.length; y += 1) {
			const row = tab[y];
			const tds = cells[y];
			let i = 0;

			for (let x = 0; x < maxWidth; x += 1) {
				if (typeof row[x] === 'number' || row[x] === null) continue;

				const td = tds[i]
				let colSpan = td.getAttribute('colSpan');
				const rowSpan = td.getAttribute('rowSpan');
				row[x] = td;

				if (1 < colSpan) {
					for (let p = 1; p < colSpan; p += 1) row[x + p] = p;
				}
				if (1 < rowSpan) {
					if (!colSpan) colSpan = 1;
					for (let q = 1; q < rowSpan; q += 1) {
						const nr = tab[y + q];
						for (let p = 0; p < colSpan; p += 1) nr[x + p] = null;
					}
				}
				i += 1;
				if (tds.length <= i) break;
			}
		}
		return tab;
	}

	function addCells(trs, cells) {
		for (let i = 0; i < trs.length; i += 1) {
			const tr = trs[i], row = [];
			if (tr.hasChildNodes()) {
				const cns = tr.childNodes;
				for (let j = 0; j < cns.length; j += 1) {
					const cn = cns[j], tn = cn.tagName;
					if (tn === 'TD' || tn === 'TH') row.push(cn);
				}
			}
			cells.push(row);
		}
	}


	// -------------------------------------------------------------------------
	// Utilities

	function getScrollBarWidth() {
		const dummy = document.createElement('div');
		dummy.style.bottom   = '100%';
		dummy.style.height   = '1px';
		dummy.style.position = 'absolute';
		dummy.style.width    = 'calc(100vw - 100%)';
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

});
