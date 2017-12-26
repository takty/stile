/**
 *
 * Content Style - Table (JS)
 *
 * @author Takuto Yanagida @ Space-Time Inc.
 * @version 2017-12-26
 *
 */


document.addEventListener('DOMContentLoaded', function () {

	var TARGET_SELECTOR = '.stile';

	var FIXED_ELEMENT_CLASS = 'st-fixed-element';
	var FIXED_HEIGHT_CLASS = 'st-fixed-height';

	var ENLARGED_CLASS = 'enlarged-table';

	var CELL_MIN_WIDTH = 120;
	var CELL_MIN_RATIO = 2 / 3;  // width : height
	var HEAD_BOTTOM_SHADOW = '0px 0.5rem 0.5rem -0.5rem rgba(0, 0, 0, 0.5)';

	var HEADER_FLOATING_WINDOW_HEIGHT_RATIO = 0.9;
	var ENLARGER_WINDOW_WIDTH_RATIO = 0.9;

	var getTableHeaderOffset = makeOffsetFunction(FIXED_ELEMENT_CLASS, FIXED_HEIGHT_CLASS);
	var scrollBarWidth;
	setTimeout(initFixedHeaderTable, 100);  // Delay for Chrome and Edge

	function initFixedHeaderTable() {
		scrollBarWidth = parseInt(getScrollBarWidth());
		var tabs = document.querySelectorAll(TARGET_SELECTOR + ' table');
		var conts = [];

		for (var i = 0; i < tabs.length; i += 1) addWrapStyle(tabs[i]);

		setTimeout(function () {  // Delay for IE11
			for (var i = 0; i < tabs.length; i += 1) {
				var tab  = tabs[i];
				var head = cloneTableHeader(tab);
				var bar  = cloneTableScrollBar(tab);
				var etb  = createEnlarger(tab);
				var cont = {table: tab, header: head, headerHeight: 0, bar: bar, etb: etb};
				initEvents(cont);
				conts.push(cont);

				windowScroll(conts[i]);
				tableScroll(conts[i]);
			}

			var scrollSt = null, resizeSt = null;
			window.addEventListener('scroll', function () {
				if (scrollSt) clearTimeout(scrollSt);
				scrollSt = setTimeout(function() {
					for (var i = 0; i < tabs.length; i += 1) windowScroll(conts[i]);
					scrollSt = null;
				}, 10);
			});
			window.addEventListener('resize', function () {
				if (resizeSt) clearTimeout(resizeSt);
				resizeSt = setTimeout(function() {
					for (var i = 0; i < tabs.length; i += 1) windowResize(conts[i]);
					resizeSt = null;
				}, 10);
			});
		}, 0);
	}

	function initEvents(cont) {
		var tab = cont.table;
		var tableScrollChanged = false, barScrollChanged = false;
		tab.addEventListener('scroll', function (e) {
			tableScroll(cont);
			if (tableScrollChanged) {
				tableScrollChanged = false;
			} else {
				cont.bar.scrollLeft = tab.scrollLeft;
				barScrollChanged = true;
			}
		});
		cont.barScrollListener = function (e) {
			if (barScrollChanged) {
				barScrollChanged = false;
			} else {
				tab.scrollLeft = cont.bar.scrollLeft;
				tableScrollChanged = true;
			}
		};
		initBarEvent(cont);
		initEnlargerEvent(cont);
	}

	function initBarEvent(cont) {
		cont.bar.addEventListener('scroll', cont.barScrollListener);
	}

	function cloneTableHeader(table) {
		var thead = table.tHead;
		if (!thead) {
			thead = createPseudoTableHeader(table);
			if (!thead) return null;
		}
		var cont = document.createElement('div');
		cont.classList.add('fixed-table-header-container');
		cont.style.maxWidth = table.clientWidth + 'px';
		cont.style.display = 'none';
		cont.style.top = (getTableHeaderOffset() + getWpAdminBarHeight()) + 'px';
		table.parentNode.appendChild(cont);

		var ptab = document.createElement('div');
		ptab.classList.add('fixed-table-header-table');
		ptab.style.width = thead.clientWidth + 'px';
		cont.appendChild(ptab);

		var clone = thead.cloneNode(true);
		ptab.appendChild(clone);

		var oTrs = thead.rows;
		var cTrs = clone.rows;
		for (var i = 0; i < oTrs.length; i += 1) {
			copyWidth(oTrs[i], cTrs[i], 'td');
			copyWidth(oTrs[i], cTrs[i], 'th');
		}
		function copyWidth(o, c, tag) {
			var os = o.getElementsByTagName(tag);
			var cs = c.getElementsByTagName(tag);
			for (var i = 0; i < os.length; i += 1) {
				cs[i].style.width = os[i].getBoundingClientRect().width + 'px';
			}
		}
		if (table.classList.contains(ENLARGED_CLASS)) cont.classList.add(ENLARGED_CLASS);
		return cont;
	}

	function createPseudoTableHeader(table) {
		var tbody = table.tBodies[0];
		var trs = tbody.rows;
		if (trs.length === 0) return null;

		function containsOnlyTh(tr) {
			var tds = tr.getElementsByTagName('td');
			var ths = tr.getElementsByTagName('th');
			if (tds.length === 0 && ths.length > 0) return true;
			return false;
		}

		var trsH = [];
		for (var i = 0, I = trs.length; i < I; i += 1) {
			var tr = trs[i];
			if (!containsOnlyTh(tr)) break;
			trsH.push(tr);
		}
		if (trsH.length === 0) return null;

		var thead = table.createTHead();
		for (var i = 0; i < trsH.length; i += 1) {
			thead.appendChild(trsH[i]);
		}
		return thead;
	}

	function cloneTableScrollBar(table) {
		var tbody = table.tBodies[0];

		var bar = document.createElement('div');
		bar.classList.add('fixed-table-scroll-bar');
		bar.style.maxWidth = table.clientWidth + 'px';
		bar.style.display = 'none';
		var h = parseInt(getScrollBarWidth());
		if (0 < h) bar.style.height = (h + 2) + 'px';
		table.parentNode.appendChild(bar);

		var spacer = document.createElement('div');
		spacer.style.width = tbody.clientWidth + 'px';
		spacer.style.height = '1px';
		bar.appendChild(spacer);

		return bar;
	}

	function windowResize(cont) {
		var tab = cont.table, head = cont.header, bar = cont.bar;
		if (tab.classList.contains(ENLARGED_CLASS)) windowResize_enlarger(tab);

		if (head) {
			if (head.parentNode) head.parentNode.removeChild(head);
			cont.header = cloneTableHeader(tab);
		}
		if (bar) {
			if (bar.parentNode) bar.parentNode.removeChild(bar);
			cont.bar = cloneTableScrollBar(tab);
			initBarEvent(cont);
		}
		if (cont.header || cont.bar) windowScroll(cont);
		tableScroll(cont);
	}

	function windowScroll(cont) {
		var tab = cont.table, head = cont.header, bar = cont.bar;
		var winX = window.scrollX | window.pageXOffset, winY = window.scrollY | window.pageYOffset;
		var tabTop = elementTopOnWindow(tab), tabBottom = tabTop + tab.clientHeight;
		var offset = getTableHeaderOffset();
		var isInWin = tab.clientHeight < HEADER_FLOATING_WINDOW_HEIGHT_RATIO * (window.innerHeight - offset);

		if (head) {
			if (isInWin) {
				head.style.display = 'none';
				switchEnlargerToTable(cont);
			} else if (winY + offset < tabTop || tabBottom - cont.headerHeight < winY + offset) {
				head.style.display = 'none';
				switchEnlargerToTable(cont);
			} else if (tabTop < winY + offset) {
				head.style.display = 'block';
				head.style.top = (getTableHeaderOffset() + getWpAdminBarHeight()) + 'px';
				head.style.boxShadow = HEAD_BOTTOM_SHADOW;
				cont.headerHeight = head.getBoundingClientRect().height;
				switchEnlargerToFloatingHeader(cont);
			}
			head.style.left = (elementLeftOnWindow(tab) - winX) + 'px';
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
			bar.style.left = (elementLeftOnWindow(tab) - winX) + 'px';
			bar.scrollLeft = tab.scrollLeft;
		}
	}

	function tableScroll(cont) {
		var tab = cont.table, head = cont.header;
		if (head) head.scrollLeft = tab.scrollLeft;
		if (tab.scrollWidth - tab.clientWidth > 2) {  // for avoiding needless scrolling
			var r = tab.scrollLeft / (tab.scrollWidth - tab.clientWidth);
			var rl = 0.15, rr = 0.15;
			if (r < 0.1) rl *= r / 0.1;
			if (0.9 < r) rr *= (1 - r) / 0.1;
			var shadow = '1.5rem 0 1.5rem -1rem rgba(0,0,0,' + rl + ') inset, -1.5rem 0 1.5rem -1rem rgba(0,0,0,' + rr + ') inset';
			tab.style.boxShadow = shadow;
			tab.style.overflowX = 'auto';
			if (head) head.style.boxShadow = shadow + ', ' + HEAD_BOTTOM_SHADOW;
		} else {
			tab.style.boxShadow = '';
			tab.style.overflowX = '';
			if (head) head.style.boxShadow = HEAD_BOTTOM_SHADOW;
		}
		tableScroll_enlarger(cont);
	}

	// Enlarger ----------------------------------------------------------------

	function createEnlarger(table) {
		var etb = document.createElement('div');
		etb.classList.add('enlarger-button');
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
		var tab = cont.table;
		if (tab.classList.contains(ENLARGED_CLASS)) {
			tab.style.marginLeft = '';
			tab.style.zIndex = '';
			tab.style.width = '';
			tab.style.maxWidth = '';
			tab.classList.remove(ENLARGED_CLASS);
		} else {
			if (tab.scrollWidth - tab.clientWidth <= 2) return;
			tab.style.zIndex = '98';
			tab.style.width = 'calc(100vw - ' + scrollBarWidth + 'px)';
			tab.style.maxWidth = '100vw';
			tab.classList.add(ENLARGED_CLASS);
		}
		windowResize(cont);
	}

	function windowResize_enlarger(tab) {
		var left = elementLeftOnWindow(tab.parentNode);
		var tbody = tab.tBodies[0];
		var width = tbody.clientWidth, pwidth = window.innerWidth - scrollBarWidth;

		if (width < pwidth) left -= (pwidth - width) / 2;
		tab.style.marginLeft = -left + 'px';
	}

	function tableScroll_enlarger(cont) {
		var tab = cont.table, etb = cont.etb;
		if (tab.scrollWidth - tab.clientWidth > 2 && tab.clientWidth < ENLARGER_WINDOW_WIDTH_RATIO * window.innerWidth) {  // for avoiding needless scrolling
			etb.style.left = (tab.scrollLeft) + 'px';
			etb.style.display = 'block';
		} else {
			etb.style.left = '0';
			if (tab.classList.contains(ENLARGED_CLASS)) {
				etb.style.display = 'block';
			} else {
				etb.style.display = 'none';
			}
		}
	}

	// Neat Wrap ---------------------------------------------------------------

	function addWrapStyle(table) {
		if (table.getAttribute('width') != null) table.setAttribute('width', '');
		table.style.maxWidth = '';

		var tbody = table.tBodies[0];
		if (tbody.clientWidth <= table.clientWidth) return;

		var tab = makeCellGrid(table);
		if (tab.length === 0) return;

		var repTd = table.getElementsByTagName('td')[0];
		var style = getComputedStyle(repTd);
		var padH = parseFloat(style.paddingLeft) + parseFloat(style.paddingRight);
		var padV = parseFloat(style.paddingTop) + parseFloat(style.paddingBottom);
		var lineHeight = parseFloat(style.lineHeight);

		var newWs = [];
		for (var x = 0; x < tab[0].length; x += 1) newWs.push(false);

		if (isIE11orOldEdge()) {
			calcNewWidthes_simply(table, tab, newWs, padH, padV, lineHeight, table.clientWidth);
		} else {
			calcNewWidthes(table, tab, newWs, padH, padV, lineHeight, table.clientWidth);
		}

		for (var y = 0; y < tab.length; y += 1) {
			var tabRow = tab[y];
			for (var x = 0; x < tabRow.length; x += 1) {
				var td = tabRow[x], newW = newWs[x];
				if (td === undefined || td === null || typeof td === 'number' || newW === false) continue;
				td.style.whiteSpace = 'normal';
				td.style.minWidth = newW + 'px';
			}
		}
	}

	function isIE11orOldEdge() {
		var ua = window.navigator.userAgent.toLowerCase();
		if (ua.indexOf('msie') !== -1 || ua.indexOf('trident') !== -1) return true;
		if (getEdgeRev(ua) < 16) return true;  // Before Fall Creators Update
		return false;

		function getEdgeRev(ua) {
			var ss = ua.split(' ');
			for (var i = 0; i < ss.length; i += 1) {
				if (ss[i].indexOf('edge') === 0) {
					return parseFloat(ss[i].split('/')[1]);
				}
			}
			return Number.MAX_VALUE;
		}
	}

	function calcNewWidthes_simply(table, tab, newWs, padH, padV, lineHeight, origTableWidth) {
		var origWs = [].concat(newWs);
		for (var y = 0; y < tab.length; y += 1) {
			var tabRow = tab[y];

			for (var x = 0; x < tabRow.length; x += 1) {
				if (newWs[x] !== false) continue;

				var td = tabRow[x];
				if (td === null || typeof td === 'number') continue;
				if (x < tabRow.length - 1 && typeof tabRow[x + 1] === 'number') continue;

				var aw = td.clientWidth - padH;
				var l = td.getElementsByTagName('br').length + 1;
				origWs[x] = aw;

				var minW = 0;
				for (var i = 2;; i += 1) {
					var tempW = aw / i + padH;
					var tempH = l * (i * lineHeight) + padV;
					if (tempW < CELL_MIN_WIDTH || tempW / tempH < CELL_MIN_RATIO) break;
					minW = tempW;
				}
				if (minW) newWs[x] = Math.max(newWs[x], minW);
			}
		}
		widenTableWidth_simply(newWs, origTableWidth, origWs);
	}

	function widenTableWidth_simply(newWs, widthOrig, origWs) {
		var widthNew = 0;
		for (var i = 0; i < newWs.length; i += 1) {
			widthNew += newWs[i];
		}
		if (widthNew >= widthOrig) return;

		var keepAws = [];
		for (var i = 0; i < newWs.length; i += 1) {
			var rw = newWs[i] / widthNew * widthOrig;
			keepAws.push(origWs[i] < rw);
		}
		for (var i = 0; i < newWs.length; i += 1) {
			if (keepAws[i]) {
				widthNew  -= newWs[i];
				widthOrig -= origWs[i];

				newWs[i] = origWs[i];
			}
		}
		for (var i = 0; i < newWs.length; i += 1) {
			if (!keepAws[i]) {
				newWs[i] = newWs[i] / widthNew * widthOrig;
			}
		}
	}

	function calcNewWidthes(table, tab, newWs, padH, padV, lineHeight, origTableWidth) {
		var dummy = document.createElement('td');
		dummy.style.display = 'inline-block';
		dummy.style.position = 'fixed';
		dummy.style.visibility = 'hidden';
		table.appendChild(dummy);

		for (var y = 0; y < tab.length; y += 1) {
			var tabRow = tab[y];

			for (var x = 0; x < tabRow.length; x += 1) {
				var td = tabRow[x];
				if (td === undefined || td === null || typeof td === 'number') continue;
				if (x < tabRow.length - 1 && typeof tabRow[x + 1] === 'number') continue;

				dummy.innerHTML = td.innerHTML + 'm';  // for adding error factor
				var aw = dummy.clientWidth - padH;
				var l = Math.round((dummy.clientHeight - padV) / lineHeight);

				var minW = 0;
				for (var i = 2;; i += 1) {
					var tempW = aw / i + padH;
					var tempH = l * (i * lineHeight) + padV;
					if (tempW < CELL_MIN_WIDTH || tempW / tempH < CELL_MIN_RATIO) break;
					minW = tempW;
				}
				if (minW) newWs[x] = Math.max(newWs[x], minW);
			}
		}
		table.removeChild(dummy);
		widenTableWidth(newWs, origTableWidth);
	}

	function widenTableWidth(newWs, widthOrig) {
		var widthNew = 0;
		for (var i = 0; i < newWs.length; i += 1) {
			widthNew += newWs[i];
		}
		if (widthNew < widthOrig) {
			for (var i = 0; i < newWs.length; i += 1) {
				newWs[i] = newWs[i] / widthNew * widthOrig;
			}
		}
	}

	function makeCellGrid(table) {
		var thead = table.tHead;
		var tbody = table.tBodies[0];
		var tfoot = table.tFoot;

		var cells = [];
		if (thead) addCells(thead.rows, cells);
		if (tbody) addCells(tbody.rows, cells);
		if (tfoot) addCells(tfoot.rows, cells);

		var maxWidth = 0, tab = [];
		for (var i = 0; i < cells.length; i += 1) {
			var w = cells[i].length;
			if (maxWidth < w) maxWidth = w;
		}
		for (var i = 0; i < cells.length; i += 1) {
			var a = [];
			a.length = maxWidth;
			tab.push(a);
		}

		for (var y = 0; y < tab.length; y += 1) {
			var row = tab[y];
			var tds = cells[y];
			var i = 0;

			for (var x = 0; x < maxWidth; x += 1) {
				if (typeof row[x] === 'number' || row[x] === null) continue;

				var td = tds[i]
				var colSpan = td.getAttribute('colSpan');
				var rowSpan = td.getAttribute('rowSpan');
				row[x] = td;

				if (1 < colSpan) {
					for (var p = 1; p < colSpan; p += 1) row[x + p] = p;
				}
				if (1 < rowSpan) {
					if (!colSpan) colSpan = 1;
					for (var q = 1; q < rowSpan; q += 1) {
						var nr = tab[y + q];
						for (var p = 0; p < colSpan; p += 1) nr[x + p] = null;
					}
				}
				i += 1;
				if (tds.length <= i) break;
			}
		}
		return tab;
	}

	function addCells(trs, cells) {
		for (var i = 0; i < trs.length; i += 1) {
			var tr = trs[i], row = [];
			if (tr.hasChildNodes()) {
				var cns = tr.childNodes;
				for (var j = 0; j < cns.length; j += 1) {
					var cn = cns[j], tn = cn.tagName;
					if (tn === 'TD' || tn === 'TH') row.push(cn);
				}
			}
			cells.push(row);
		}
	}


	// Utilities ---------------------------------------------------------------

	function makeOffsetFunction(fixedElementClass, fixedHeightClass) {
		var elmFixed = document.getElementsByClassName(fixedElementClass);
		if (elmFixed && elmFixed.length > 0) {
			elmFixed = elmFixed[0];
			var elmHeight = document.getElementsByClassName(fixedHeightClass);
			if (elmHeight) elmHeight = elmHeight[0];
			else elmHeight = elmFixed;

			return function () {
				var pos = getComputedStyle(elmFixed).position;
				return pos === 'fixed' ? elmHeight.clientHeight : 0;
			};
		}
		return function () { return 0; }
	}

	function getWpAdminBarHeight() {
		var wpab = document.getElementById('wpadminbar');
		return (wpab) ? wpab.clientHeight : 0;
	}

	function elementLeftOnWindow(elm) {
		var left = 0;
		while (elm) {
			left += elm.offsetLeft;
			elm = elm.offsetParent;
		}
		return left;
	}

	function elementTopOnWindow(elm) {
		var top = 0;
		while (elm) {
			top += elm.offsetTop;
			elm = elm.offsetParent;
		}
		return top;
	}

	function getScrollBarWidth() {
		var dummy = document.createElement('div');
		dummy.style.bottom   = '100%';
		dummy.style.height   = '1px';
		dummy.style.position = 'absolute';
		dummy.style.width    = 'calc(100vw - 100%)';
		document.body.appendChild(dummy);
		var width = window.getComputedStyle(dummy, null).getPropertyValue('width');
		document.body.removeChild(dummy);
		return width;
	}

});
