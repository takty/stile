/* eslint-disable no-underscore-dangle */
/**
 *
 * Modal Box (JS)
 *
 * @author Takuto Yanagida @ Space-Time Inc.
 * @version 2019-10-29
 *
 */


window.ST = window['ST'] || {};


(function (NS) {

	const SEL_TARGET_MODAL_BOX = '[data-stile ~= "modal-box"]';
	const ST_MODAL_BOX         = 'modal-box';
	const ST_MODAL_BOX_CLOSE   = 'modal-box-close';
	const ST_STATE_VISIBLE     = 'visible';


	NS.addInit(2, () => {
		const objs = [];
		const as1 = document.querySelectorAll(SEL_TARGET_MODAL_BOX);
		modifyModalBoxStyle(as1, objs);
	});

	function modifyModalBoxStyle(ts, objs) {
		for (let i = 0; i < ts.length; i += 1) objs.push(new ModalBox(ts[i]));

		const mo = new MutationObserver((ms) => {
			for (let i = 0; i < ms.length; i += 1) {
				for (let j = 0; j < ts.length; j += 1) {
					if (ms[i].target === ts[j] && ts[j].classList.contains(ST_STATE_VISIBLE)) objs[j].onOpen();
				}
			}
		});
		const opts = { attributes: true, childList: false, characterData: false, attributeFilter: ['class'] };
		for (let i = 0; i < ts.length; i += 1) { mo.observe(ts[i], opts); }
		NS.onResize(() => { for (let i = 0; i < objs.length; i += 1) objs[i].onResize(); }, true);
	}

	function preventWindowTouchMove(f) {
		let isTouching = false;
		window.addEventListener('touchmove', (e) => {
			if (!isTouching) return;
			e.preventDefault();
			e.stopImmediatePropagation();
		}, { passive: false });
		f.addEventListener('touchstart', () => { isTouching = true; });
		f.addEventListener('touchend', () => { isTouching = false; });
	}


	// -------------------------------------------------------------------------


	class ModalBox {

		constructor(frm) {
			this._frm = frm;
			this._child = frm.querySelector('*[data-aspect]');
			NS.addStile(this._frm, ST_MODAL_BOX);
			this._frm.addEventListener('click', (e) => { this.onClose(e); });

			const btn = document.createElement('span');
			NS.addStile(btn, ST_MODAL_BOX_CLOSE);
			this._frm.appendChild(btn);

			preventWindowTouchMove(this._frm);
			this._frm.addEventListener('wheel', (e) => {
				e.stopPropagation();
				e.preventDefault();
			});
			this._isOpened = false;
		}

		onOpen() {
			this._isOpened = true;
			this.onResize();
			this._frm.style.opacity = 1;
		}

		onResize() {
			if (this._isOpened && this._child) {
				const r = this._frm.getBoundingClientRect();
				const w = r.right - r.left;
				const h = r.bottom - r.top;
				const fw = (h * parseFloat(this._child.dataset.aspect));
				this._child.style.width = (w < fw) ? '' : (fw + 'px');
			}
		}

		onClose(e) {
			e.preventDefault();
			this._isOpened = false;
			this._frm.style.opacity = null;
			setTimeout(() => {
				NS.removeStile(this._frm, ST_STATE_VISIBLE);
				this._frm.classList.remove(ST_STATE_VISIBLE);
				if (this._child) this._child.style.width = null;
			}, 250);
		}

	}

})(window.ST);
