/* eslint-disable no-underscore-dangle */
/**
 *
 * Table Style - Fixed Header (JS)
 *
 * @author Takuto Yanagida @ Space-Time Inc.
 * @version 2019-06-09
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

	const getTableHeaderOffset = (function () {
		const f = NS.makeOffsetFunction(CLS_STICKY_ELM, CLS_STICKY_ELM_TOP);
		return () => f() + NS.getWpAdminBarHeight();
	})();
	let scrollBarWidth;

	NS.addInitializer(5, () => {
		const tabs = document.querySelectorAll(SEL_TARGET + ' table:not([class])');
		setTimeout(() => { initialize(tabs); }, 0);  // Delay for IE11
	});


	// -------------------------------------------------------------------------


	function initialize(tabs) {
		scrollBarWidth = parseInt(getScrollBarWidth());
		const conts = [];
		for (let i = 0; i < tabs.length; i += 1) conts.push(new FixedHeaderTable(tabs[i]));
		NS.onScroll(() => { for (let c of conts) c.onWindowScroll(); });
		NS.onResize(() => { for (let c of conts) c.onWindowResize(); });
	}

	class FixedHeaderTable {

		constructor (tab) {
			if (tab.style.height) tab.style.height = '';
			this._table        = tab;
			this._headerHeight = 0;
			this._isEnlarged   = false;
			this._create();
			setTimeout(() => { this._initialize(); }, 10);
		}

		_create() {
			this._head = this._createHeaderClone();
			this._sbar = this._createScrollBarClone();
			this._ebtn = NS.containStile(this._table, ST_OPT_NO_ENLARGER) ? null : this._createEnlargerButton();

			const caps = this._table.getElementsByTagName('caption');
			this._capt = caps.length ? caps[0] : null;
			if ((NS.BROWSER === 'ie11' || NS.BROWSER === 'edge') && this._head && this._capt) {
				this._table.insertBefore(this._capt, this._table.firstChild);  // Replace the order of caption and header
			}
		}

		_createHeaderClone() {
			let thead = this._table.tHead;
			if (!thead) {
				thead = this._createPseudoHeader();
				if (!thead) return null;
				this._table.tHead = thead;
			}
			const cont = document.createElement('div');
			NS.addStile(cont, ST_HEADER_CONTAINER);
			this._table.parentNode.appendChild(cont);

			const ptab = document.createElement('div');
			NS.addStile(ptab, ST_HEADER_TABLE);
			cont.appendChild(ptab);

			const clone = thead.cloneNode(true);
			ptab.appendChild(clone);

			if (NS.containStile(this._table, ST_STATE_ENLARGED)) NS.addStile(cont, ST_STATE_ENLARGED);
			return cont;
		}

		_createPseudoHeader() {
			const tbody = this._table.tBodies[0];
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

			const thead = this._table.createTHead();
			for (let i = 0; i < trsH.length; i += 1) {
				thead.appendChild(trsH[i]);
			}
			return thead;
		}

		_createScrollBarClone() {
			const sbar = document.createElement('div');
			NS.addStile(sbar, ST_SCROLL_BAR);
			this._table.parentNode.appendChild(sbar);
			const spacer = document.createElement('div');
			sbar.appendChild(spacer);
			return sbar;
		}

		_createEnlargerButton() {
			const ebtn = document.createElement('div');
			ebtn.dataset['stile'] = ST_ENLARGER_BUTTON;
			this._table.appendChild(ebtn);
			return ebtn;
		}


		// ---------------------------------------------------------------------


		_initialize() {
			this._initTableScroll();
			if (this._ebtn) {
				this._ebtn.addEventListener('click', () => { this._toggleEnlarge(); });
				if (!this._isEnlargable()) this._ebtn.style.display = 'none';
			}
			this._resize();
		}

		_initTableScroll() {
			let tableScrollChanged = false;
			let sbarScrollChanged  = false;
			this._table.addEventListener('scroll', NS.throttle(() => {
				if (tableScrollChanged) {
					tableScrollChanged = false;
				} else {
					this._sbar.scrollLeft = this._table.scrollLeft;
					sbarScrollChanged = true;
				}
				this._onTableScroll();
			}));
			this._sbar.addEventListener('scroll', NS.throttle(() => {
				if (sbarScrollChanged) {
					sbarScrollChanged = false;
				} else {
					this._table.scrollLeft = this._sbar.scrollLeft;
					tableScrollChanged = true;
				}
			}));
		}

		_isScrollable() {
			const t = this._table;
			return (t.scrollWidth - t.clientWidth > 2);  // for avoiding needless scrolling
		}

		_isEnlargable() {
			const t = this._table;
			return (t.scrollWidth - t.offsetWidth > 1 && t.offsetWidth < ENLARGER_WINDOW_WIDTH_RATIO * window.innerWidth);  // for avoiding needless scrolling
		}

		_toggleEnlarge() {
			const tab = this._table, head = this._head;
			if (this._isEnlarged) {
				tab.style.width = '';
				tab.style.marginLeft = '';
				NS.removeStile(tab, ST_STATE_ENLARGED);
				NS.removeStile(head, ST_STATE_ENLARGED);
				this._isEnlarged = false;
			} else {
				if (tab.scrollWidth - tab.offsetWidth <= 1) return;
				tab.style.width = 'calc(100vw - ' + scrollBarWidth + 'px)';
				tab.scrollLeft = 0;
				NS.addStile(tab, ST_STATE_ENLARGED);
				NS.addStile(head, ST_STATE_ENLARGED);
				this._isEnlarged = true;
			}
			if (this._ebtn && this._isEnlarged) this._updateEnlagedTablePosition();
			this._resize();
		}


		// ---------------------------------------------------------------------


		onWindowResize() {
			if (this._ebtn && this._isEnlarged) {
				this._toggleEnlarge();
			} else {
				this._resize();
			}
		}

		_resize() {
			if (this._head) this._updateHeaderSize(this._head);
			if (this._sbar) this._updateScrollBarSize(this._sbar);
			if (this._head || this._sbar) this.onWindowScroll();
			this._onTableScroll();
		}

		_updateHeaderSize(cont) {
			let thead = this._table.tHead;
			cont.style.maxWidth = this._table.getBoundingClientRect().width + 'px';
			cont.style.display = 'none';
			cont.style.top = getTableHeaderOffset() + 'px';

			const ptab = cont.firstChild;
			let w = thead.getBoundingClientRect().width;
			if (NS.BROWSER === 'ie11') w = Math.ceil(w);
			ptab.style.width = w + 'px';

			const clone = ptab.firstChild;

			const oTrs = thead.rows;
			const cTrs = clone.rows;
			for (let i = 0; i < oTrs.length; i += 1) {
				copyWidth(oTrs[i], cTrs[i], 'td');
				copyWidth(oTrs[i], cTrs[i], 'th');
			}
			this._headerHeight = thead.getBoundingClientRect().height;
			function copyWidth(o, c, tag) {
				const os = o.getElementsByTagName(tag);
				const cs = c.getElementsByTagName(tag);
				for (let i = 0; i < os.length; i += 1) {
					cs[i].style.width = os[i].getBoundingClientRect().width + 'px';
				}
			}
		}

		_updateScrollBarSize(sbar) {
			sbar.style.maxWidth = this._table.clientWidth + 'px';
			sbar.style.display = 'none';
			const h = parseInt(getScrollBarWidth());
			if (0 < h) sbar.style.height = (h + 2) + 'px';

			const tbody = this._table.tBodies[0];
			const spacer = sbar.firstChild;
			spacer.style.width = Math.ceil(tbody.clientWidth) + 'px';
		}

		_updateEnlagedTablePosition() {
			let left = this._table.getBoundingClientRect().left + window.pageXOffset;
			const tbody = this._table.tBodies[0];
			const width = tbody.clientWidth, pwidth = window.innerWidth - scrollBarWidth;

			if (width < pwidth) left -= (pwidth - width) / 2;
			this._table.style.marginLeft = -left + 'px';
		}


		// ---------------------------------------------------------------------


		onWindowScroll() {
			const tr     = this._table.getBoundingClientRect();
			const tabTop = tr.top, tabBottom = tr.bottom;
			const offset = getTableHeaderOffset();
			const capH   = this._capt ? this._capt.offsetHeight : 0;
			const headH  = this._headerHeight;
			const inView = tabBottom - tabTop - capH < HEADER_FLOATING_WINDOW_HEIGHT_RATIO * (window.innerHeight - offset);

			let headVisible = false;
			if (inView) {  // do nothing
			} else if (offset < tabTop + capH) {  // do nothing
			} else if (tabBottom - headH < offset) {  // do nothing
			} else if (tabTop + capH < offset) {
				headVisible = true;
			}
			let sbarVisible = false;
			if (inView) {  // do nothing
			} else if (window.innerHeight < tabTop + capH + headH) {  // do nothing
			} else if (tabBottom < window.innerHeight) {  // do nothing
			} else if (this._isScrollable()) {
				sbarVisible = true;
			}
			if (this._head) this.updateHeaderVisibility(headVisible, tr.left);
			if (this._sbar) this.updateScrollBarVisibility(sbarVisible, tr.left);
		}

		updateHeaderVisibility(visible, tabLeft) {
			const head = this._head;
			if (visible) {
				head.style.top = (getTableHeaderOffset() + NS.getWpAdminBarHeight()) + 'px';
				head.style.boxShadow = HEAD_BOTTOM_SHADOW;
				head.style.display = 'block';
				if (this._ebtn) this.switchEnlargerToFloatingHeader();
			} else {
				head.style.display = 'none';
				if (this._ebtn) this.switchEnlargerToTable();
			}
			head.style.left = tabLeft + 'px';
			head.scrollLeft = this._table.scrollLeft;
		}

		switchEnlargerToTable() {
			this._ebtn.parentNode.removeChild(this._ebtn);
			this._ebtn.style.top = this._capt ? (this._capt.offsetHeight + 'px') : 0;
			this._table.appendChild(this._ebtn);
		}

		switchEnlargerToFloatingHeader() {
			this._ebtn.parentNode.removeChild(this._ebtn);
			this._ebtn.style.top = 0;
			this._head.appendChild(this._ebtn);
		}

		updateScrollBarVisibility(visible, tabLeft) {
			const sbar = this._sbar;
			if (visible) {
				sbar.style.display = 'block';
			} else {
				sbar.style.display = 'none';
			}
			sbar.style.left = tabLeft + 'px';
			sbar.scrollLeft = this._table.scrollLeft;
		}


		// ---------------------------------------------------------------------


		_onTableScroll() {
			const tab = this._table, head = this._head, capt = this._capt, ebtn = this._ebtn;
			const sL = tab.scrollLeft;
			if (head) head.scrollLeft = sL;
			if (capt) capt.style.transform = this._isScrollable() ? `translateX(${sL}px)` : null;
			if (ebtn) {
				NS.removeStile(ebtn, 'visible');
				if (this._tse) clearTimeout(this._tse);
				this._tse = setTimeout(() => { NS.addStile(ebtn, 'visible'); }, 200);
				this._updateEnlager();
			}
			this._updateShade();
		}

		_updateEnlager() {
			const tab = this._table, capt = this._capt, ebtn = this._ebtn;
			const sL = tab.scrollLeft;

			const tbody = this._table.tBodies[0];
			const scrW = tbody.clientWidth, cltW = tab.clientWidth;
			if (this._isEnlargable() || this._isEnlarged) {
				let etbRight = -Math.min(scrW - cltW, sL);  // for Mobile Safari
				if (!this._isEnlargable() && this._isEnlarged) {
					const diff = ebtn.parentElement.clientWidth - scrW;
					if (0 < diff) etbRight = diff;
				}
				if (ebtn.parentNode === tab) ebtn.style.top = capt ? (capt.offsetHeight + 'px') : 0;
				ebtn.style.right = etbRight + 'px';
				ebtn.style.display = 'block';
			} else {
				ebtn.style.display = 'none';
			}
		}

		_updateShade() {
			const tab = this._table, head = this._head;
			if (this._isScrollable()) {
				const shadow = this._calcShadeStyle();
				tab.style.boxShadow = shadow;
				tab.style.overflowX = 'auto';
				if (head) head.style.boxShadow = shadow + ', ' + HEAD_BOTTOM_SHADOW;
			} else {
				tab.style.boxShadow = '';
				tab.style.overflowX = '';
				if (head) head.style.boxShadow = HEAD_BOTTOM_SHADOW;
			}
		}

		_calcShadeStyle() {
			const tab = this._table;
			const r = tab.scrollLeft / (tab.scrollWidth - tab.clientWidth);
			let rl = 0.15, rr = 0.15;
			if (r < 0.1) rl *= r / 0.1;
			if (0.9 < r) rr *= (1 - r) / 0.1;
			return '1.5rem 0 1.5rem -1rem rgba(0,0,0,' + rl + ') inset, -1.5rem 0 1.5rem -1rem rgba(0,0,0,' + rr + ') inset';
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
