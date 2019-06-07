/* eslint-disable no-underscore-dangle */
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
		for (let i = 0; i < tabs.length; i += 1) conts.push(new FixedHeaderTable(tabs[i]));
		NS.onScroll(() => { for (let i = 0; i < conts.length; i += 1) conts[i].onWindowScroll(); });
		NS.onResize(() => { for (let i = 0; i < conts.length; i += 1) conts[i].onWindowResize(); });
	}

	class FixedHeaderTable {

		constructor (tab) {
			if (tab.style.height) tab.style.height = '';

			this._table        = tab;
			this._headerHeight = 0;
			this._calcWidth    = 0;
			this._isEnlarged   = false;
			this._create();
			this._initialize();

			this.onWindowScroll();
			this._onTableScroll();
		}

		_create() {
			this._head = this._createHeaderClone();
			this._bar  = this._createScrollBarClone();
			this._etb  = NS.containStile(this._table, ST_OPT_NO_ENLARGER) ? null : this._createEnlarger();

			const caps = this._table.getElementsByTagName('caption');
			this._cap = caps.length ? caps[0] : null;
			if ((NS.BROWSER === 'ie11' || NS.BROWSER === 'edge') && this._head && this._cap) {
				this._table.insertBefore(this._cap, this._table.firstChild);  // Replace the order of caption and header
			}
		}

		_createHeaderClone() {
			let thead = this._table.tHead;
			if (!thead) {
				thead = this._createPseudoHeader();
				if (!thead) return null;
			}
			const cont = document.createElement('div');
			NS.addStile(cont, ST_HEADER_CONTAINER);
			cont.style.maxWidth = this._table.getBoundingClientRect().width + 'px';
			cont.style.display = 'none';
			cont.style.top = (getTableHeaderOffset() + NS.getWpAdminBarHeight()) + 'px';
			cont.style.marginTop = '0';  // for cancel 'stile-margin-basic'
			this._table.parentNode.appendChild(cont);

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
			const bar = document.createElement('div');
			NS.addStile(bar, ST_SCROLL_BAR);
			this._table.parentNode.appendChild(bar);
			const spacer = document.createElement('div');
			spacer.style.height = '1px';
			bar.appendChild(spacer);
			this._updateScrollBar(bar);
			return bar;
		}

		_createEnlarger() {
			const etb = document.createElement('div');
			etb.dataset['stile'] = ST_ENLARGER_BUTTON;
			this._table.appendChild(etb);
			return etb;
		}


		// ---------------------------------------------------------------------


		_initialize() {
			this._initTableScroll();
			if (this._etb) {
				this._etb.addEventListener('click', () => {
					this._toggleEnlarge();
					this.onWindowResize();
				});
				if (!this._isEnlargable()) this._etb.style.display = 'none';
			}
			this._calcWidth = this._table.offsetWidth;
		}

		_toggleEnlarge() {
			const tab = this._table;
			if (this._isEnlarged) {
				tab.style.marginLeft = '';
				tab.style.zIndex = '';
				tab.style.width = '';
				tab.style.maxWidth = '';
				NS.removeStile(tab, ST_STATE_ENLARGED);
				this._isEnlarged = false;
			} else {
				if (tab.scrollWidth - tab.offsetWidth <= 1) return;
				tab.style.zIndex = '98';
				tab.style.width = 'calc(100vw - ' + scrollBarWidth + 'px)';
				tab.style.maxWidth = '100vw';
				tab.scrollLeft = 0;
				NS.addStile(tab, ST_STATE_ENLARGED);
				this._isEnlarged = true;
			}
		}


		// ---------------------------------------------------------------------


		onWindowResize() {
			const head = this._head, bar = this._bar;
			if (this._etb && this._isEnlarged) {
				let left = this._table.getBoundingClientRect().left + window.pageXOffset;
				const tbody = this._table.tBodies[0];
				const width = tbody.clientWidth, pwidth = window.innerWidth - scrollBarWidth;

				if (width < pwidth) left -= (pwidth - width) / 2;
				this._table.style.marginLeft = -left + 'px';
			}
			if (head) {
				if (head.parentNode) head.parentNode.removeChild(head);
				this._head = this._createHeaderClone();
			}
			if (bar) this._updateScrollBar(bar);
			this._calcWidth = this._table.offsetWidth;
			if (this._head || this._bar) this.onWindowScroll();
			this._onTableScroll();
		}

		_updateScrollBar(bar) {
			bar.style.maxWidth = this._table.clientWidth + 'px';
			bar.style.display = 'none';
			const h = parseInt(getScrollBarWidth());
			if (0 < h) bar.style.height = (h + 2) + 'px';

			const tbody = this._table.tBodies[0];
			const spacer = bar.firstChild;
			spacer.style.width = Math.ceil(tbody.clientWidth) + 'px';
		}

		onWindowScroll() {
			if (this._calcWidth !== this._table.offsetWidth) this.onWindowResize();

			const tab = this._table, head = this._head, bar = this._bar, cap = this._cap;
			const winY = window.pageYOffset;
			const tabTop = tab.getBoundingClientRect().top + winY, tabBottom = tabTop + tab.offsetHeight;
			const capH = cap ? cap.offsetHeight : 0;
			const offset = getTableHeaderOffset() + NS.getWpAdminBarHeight() - capH;
			const isInWin = tab.offsetHeight < HEADER_FLOATING_WINDOW_HEIGHT_RATIO * (window.innerHeight - offset);
			const tabLeft = (head || bar) ? (tab.getBoundingClientRect().left + 'px') : '';

			if (head) {
				if (isInWin) {
					head.style.display = 'none';
					if (this._etb) this.switchEnlargerToTable();
				} else if (winY + offset < tabTop || tabBottom - this._headerHeight < winY + offset) {
					head.style.display = 'none';
					if (this._etb) this.switchEnlargerToTable();
				} else if (tabTop < winY + offset) {
					head.style.display = 'block';
					head.style.top = (getTableHeaderOffset() + NS.getWpAdminBarHeight()) + 'px';
					head.style.boxShadow = HEAD_BOTTOM_SHADOW;
					this._headerHeight = head.getBoundingClientRect().height;
					if (this._etb) this.switchEnlargerToFloatingHeader();
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

		switchEnlargerToTable() {
			this._etb.parentNode.removeChild(this._etb);
			this._etb.style.top = this._cap ? (this._cap.offsetHeight + 'px') : 0;
			this._table.appendChild(this._etb);
		}

		switchEnlargerToFloatingHeader() {
			this._etb.parentNode.removeChild(this._etb);
			this._etb.style.top = 0;
			this._head.appendChild(this._etb);
		}


		// ---------------------------------------------------------------------


		_isScrollable() {
			const t = this._table;
			return (t.scrollWidth - t.clientWidth > 2);  // for avoiding needless scrolling
		}

		_isEnlargable() {
			const t = this._table;
			return (t.scrollWidth - t.offsetWidth > 1 && t.offsetWidth < ENLARGER_WINDOW_WIDTH_RATIO * window.innerWidth);  // for avoiding needless scrolling
		}

		_initTableScroll() {
			let tableScrollChanged = false, barScrollChanged = false;
			this._table.addEventListener('scroll', NS.throttle(() => {
				if (tableScrollChanged) {
					tableScrollChanged = false;
				} else {
					this._bar.scrollLeft = this._table.scrollLeft;
					barScrollChanged = true;
				}
				this._onTableScroll();
			}));
			this._bar.addEventListener('scroll', NS.throttle(() => {
				if (barScrollChanged) {
					barScrollChanged = false;
				} else {
					this._table.scrollLeft = this._bar.scrollLeft;
					tableScrollChanged = true;
				}
			}));
		}

		_onTableScroll() {
			const tab = this._table, head = this._head, cap = this._cap, etb = this._etb;
			if (head) head.scrollLeft = tab.scrollLeft;
			if (cap) {
				if (this._isScrollable()) {
					cap.style.transform = 'translateX(' + tab.scrollLeft + 'px)';
				} else {
					cap.style.transform = null;
				}
			}
			if (etb) {
				NS.removeStile(etb, 'visible');
				if (this._tse) clearTimeout(this._tse);
				this._tse = setTimeout(() => { NS.addStile(etb, 'visible'); }, 200);

				const bodyW = tab.tBodies[0].clientWidth;
				if (this._isEnlargable()) {
					const pos = Math.min(bodyW - tab.offsetWidth, tab.scrollLeft);  // for Mobile Safari
					etb.style.right = (-pos) + 'px';
					if (etb.parentNode === tab) etb.style.top = cap ? (cap.offsetHeight + 'px') : 0;
					etb.style.display = 'block';
				} else if (this._isEnlarged) {
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
			this._updateShade();
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
