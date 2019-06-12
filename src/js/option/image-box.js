/* eslint-disable no-underscore-dangle */
/**
 *
 * Image Box (JS)
 *
 * @author Takuto Yanagida @ Space-Time Inc.
 * @version 2019-06-12
 *
 */


window.ST = window['ST'] || {};


(function (NS) {

	const TARGET_SELECTOR             = '.stile';
	const TARGET_SELECTOR_IMAGE_BOX   = '.stile-image-box';
	const STILE_CLS_IMAGE_BOX         = 'image-box';
	const STILE_CLS_IMAGE_BOX_CLOSE   = 'image-box-close';
	const STILE_CLS_IMAGE_BOX_CAPTION = 'image-box-caption';
	const STILE_STATE_OPEN            = 'open';
	const STILE_STATE_VISIBLE         = 'visible';
	const SIZE_BOX_PADDING            = '4rem';

	NS.addInitializer(7, () => {
		const objs = [];

		const as1 = document.querySelectorAll(TARGET_SELECTOR + ' a');
		modifyImageAnchorStyle(as1, objs);
		const as2 = document.querySelectorAll(TARGET_SELECTOR_IMAGE_BOX + ' a');
		modifyImageAnchorStyle(as2, objs);

		NS.onResize(() => {
			for (let obj of objs) obj.setInitialSize();
			setTimeout(() => {
				for (let obj of objs) obj.setInitialSize();
			}, 200);
		});
	});

	function modifyImageAnchorStyle(as, objs) {
		const fas = filterImageLink(as);
		for (let i = 0; i < fas.length; i += 1) { objs.push(new ImageBox(fas[i])); }
	}

	function filterImageLink(as) {
		const ret = [];
		for (let i = 0; i < as.length; i += 1) {
			const a = as[i];
			if (!NS.containStile(a, 'link-image')) continue;
			const href = a.href;
			if (!href || !isImageUrl(href)) continue;
			const imgs = a.getElementsByTagName('img');
			if (imgs.length === 0) continue;
			const img = imgs[0];
			const src = img.dataset.src ? img.dataset.src : img.src;
			if (!src || !isImageUrl(src)) continue;
			ret.push(a);
		}
		return ret;
	}

	function isImageUrl(url) {
		url = url.split('?')[0];
		url = url.toLowerCase();
		const ss = url.split('.');
		const ext = ss[ss.length - 1];
		switch (ext) {
			case 'jpeg':
			case 'jpg':
			case 'png':
			case 'gif':
				return true;
		}
		return false;
	}


	// -------------------------------------------------------------------------


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

	function touchDistance(ts) {
		const x1 = ts[0].screenX;
		const y1 = ts[0].screenY;
		const x2 = ts[1].screenX;
		const y2 = ts[1].screenY;
		return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
	}


	// -------------------------------------------------------------------------


	class ImageBox {

		constructor(a) {
			this._src = a.href;
			a.addEventListener('click', (e) => { this.onOpen(e); });

			this._frm = document.createElement('div');
			NS.addStile(this._frm, STILE_CLS_IMAGE_BOX);
			this._frm.addEventListener('click', (e) => { this.onClose(e); });

			this._img = document.createElement('img');
			this._img.addEventListener('click', (e) => { e.stopPropagation(); });
			this._frm.appendChild(this._img);

			const btn = document.createElement('span');
			NS.addStile(btn, STILE_CLS_IMAGE_BOX_CLOSE);
			this._frm.appendChild(btn);

			if (a.parentNode.tagName === 'FIGURE') {
				const fcs = a.parentNode.getElementsByTagName('figcaption');
				if (0 < fcs.length) {
					const cap = document.createElement('div');
					cap.innerHTML = fcs[0].innerHTML;
					NS.addStile(cap, STILE_CLS_IMAGE_BOX_CAPTION);
					this._frm.appendChild(cap);
				}
			}
			document.body.appendChild(this._frm);

			this.enableMouseGesture();
			this.enableTouchGesture();
		}

		onOpen(e) {
			e.preventDefault();
			NS.addStile(this._frm, STILE_STATE_OPEN);
			if (!this._img.src) {
				this._img.style.opacity = '0';
				this._img.src = this._src;
				this._img.addEventListener('load', () => {
					this.setInitialSize();
					this._img.style.opacity = '1';
				});
			} else {
				this.setInitialSize();
			}
			const delay = NS.BROWSER === 'ie11' ? 30 : 0;
			setTimeout(() => { NS.addStile(this._frm, STILE_STATE_VISIBLE); }, delay);
		}

		onClose(e) {
			e.preventDefault();
			NS.removeStile(this._frm, STILE_STATE_VISIBLE);
			setTimeout(() => { NS.removeStile(this._frm, STILE_STATE_OPEN); }, 200);
		}

		setInitialSize() {  // Called also when 'onResize'
			this._isPhone  = NS.MEDIA_WIDTH.indexOf('phone') !== -1;
			this._baseSize = this._isLandscape ? this._frm.clientWidth : this._frm.clientHeight;
			this._scale    = 1;

			const winAs = this._frm.clientWidth / this._frm.clientHeight;
			const imgAs = this._img.offsetWidth   / this._img.offsetHeight;
			this._isLandscape = (winAs < imgAs);

			const size = this._isPhone ? '100%' : 'calc(100% - ' + SIZE_BOX_PADDING + ')';
			if (this._isLandscape) {
				this._img.style.minWidth = '';  // To be assigned by setScale
				this._img.style.width    = size;
				this._img.style.height   = 'auto';
			} else {
				this._img.style.minHeight = '';  // To be assigned by setScale
				this._img.style.width     = 'auto';
				this._img.style.maxWidth  = 'none';
				this._img.style.height    = size;
			}
			this.doCenteringImage();
		}

		setScaledSize(scale) {
			this._scale = Math.max(1, Math.min(4, scale));
			let size = '';
			if (this._isPhone) {
				size = (this._baseSize * this._scale) + 'px';
			} else {
				size = 'calc(' + (this._baseSize * this._scale) + 'px - ' + SIZE_BOX_PADDING + ')';
			}
			if (this._isLandscape) this._img.style.minWidth = size;
			else this._img.style.minHeight = size;
			this.doCenteringImage();
		}

		doCenteringImage() {
			const imgW = this._img.offsetWidth, imgH = this._img.offsetHeight;
			const frmW = this._frm.clientWidth, frmH = this._frm.clientHeight;
			if (imgW < frmW) {
				this._img.style.left = ((frmW - imgW) / 2) + 'px';
			} else {
				this._img.style.left = 0;
			}
			if (imgH < frmH) {
				this._img.style.top = ((frmH - imgH) / 2) + 'px';
			} else {
				this._img.style.top = 0;
			}
		}

		enableMouseGesture() {
			let xS = 0, yS = 0;
			let isMoving = false;

			this._frm.addEventListener('mousedown', (e) => {
				e.preventDefault();
				xS = e.pageX - window.pageXOffset;
				yS = e.pageY - window.pageYOffset;
				isMoving = true;
			});
			this._frm.addEventListener('mousemove', (e) => {
				if (!isMoving) return;
				e.stopPropagation();
				e.preventDefault();
				this._frm.style.overflow = 'hidden';
				const cx = e.pageX - window.pageXOffset;
				const cy = e.pageY - window.pageYOffset;
				this._frm.scrollLeft += xS - cx;
				this._frm.scrollTop  += yS - cy;
				xS = cx;
				yS = cy;
			});
			this._frm.addEventListener('mousedrag', (e) => {
				if (!isMoving) return;
				e.stopPropagation();
				e.preventDefault();
			});
			this._frm.addEventListener('mouseup', () => { isMoving = false; });

			this._frm.addEventListener('wheel', (e) => {
				e.stopPropagation();
				e.preventDefault();

				const scx = e.pageX - window.pageXOffset;
				const scy = e.pageY - window.pageYOffset;
				const imgCx = (scx + this._frm.scrollLeft) / this._scale;
				const imgCy = (scy + this._frm.scrollTop)  / this._scale;

				const s = 0 > e.deltaY ? 1.1 : 0.9;
				this.setScaledSize(this._scale * s);

				this._frm.scrollLeft = imgCx * this._scale - scx;
				this._frm.scrollTop  = imgCy * this._scale - scy;
			}, true);
		}

		enableTouchGesture() {
			let xS = 0, yS = 0;
			let lastTouchCount = 0;
			let baseDist = 0;

			function updatePoint(ts) {
				lastTouchCount = ts.length;
				if (lastTouchCount === 1) {
					xS = ts[0].pageX - window.pageXOffset;
					yS = ts[0].pageY - window.pageYOffset;
				} else if (lastTouchCount === 2) {
					xS = (ts[0].pageX + ts[1].pageX) / 2 - window.pageXOffset;
					yS = (ts[0].pageY + ts[1].pageY) / 2 - window.pageYOffset;
				}
			}

			this._frm.addEventListener('touchstart', (e) => {
				baseDist = 0;
				updatePoint(e.touches);
			});
			this._frm.addEventListener('touchmove', (e) => {
				e.preventDefault();
				e.stopPropagation();

				const ts = e.touches;
				if (lastTouchCount !== ts.length) updatePoint(ts);

				if (ts.length === 1) {
					const cx = ts[0].pageX - window.pageXOffset;
					const cy = ts[0].pageY - window.pageYOffset;
					this._frm.scrollLeft += xS - cx;
					this._frm.scrollTop += yS - cy;
					xS = cx;
					yS = cy;
				} else if (ts.length > 1) {
					const dist = touchDistance(ts);

					const scx = (ts[0].pageX + ts[1].pageX) / 2 - window.pageXOffset;
					const scy = (ts[0].pageY + ts[1].pageY) / 2 - window.pageYOffset;
					this._frm.scrollLeft += xS - scx;
					this._frm.scrollTop += yS - scy;
					xS = scx;
					yS = scy;

					const imgCx = (scx + this._frm.scrollLeft) / this._scale;
					const imgCy = (scy + this._frm.scrollTop)  / this._scale;

					if (baseDist) {
						const s = dist / (baseDist * this._scale);
						if (s && s !== Infinity) {
							this.setScaledSize(this._scale * s);

							this._frm.scrollLeft = imgCx * this._scale - scx;
							this._frm.scrollTop  = imgCy * this._scale - scy;
						}
					}
					baseDist = dist / this._scale;
				}
			}, { passive: false });

			// for Android
			preventWindowTouchMove(this._frm);
		}

	}

})(window.ST);
