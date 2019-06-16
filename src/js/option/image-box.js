/* eslint-disable no-underscore-dangle */
/**
 *
 * Image Box (JS)
 *
 * @author Takuto Yanagida @ Space-Time Inc.
 * @version 2019-06-16
 *
 */


window.ST = window['ST'] || {};


(function (NS) {

	const SEL_TARGET           = '.stile';
	const SEL_TARGET_IMAGE_BOX = '.stile-image-box';
	const ST_IMAGE_BOX         = 'image-box';
	const ST_IMAGE_BOX_CLOSE   = 'image-box-close';
	const ST_IMAGE_BOX_CAPTION = 'image-box-caption';
	const ST_STATE_OPEN        = 'open';
	const ST_STATE_VISIBLE     = 'visible';
	const SIZE_BOX_PADDING     = '4rem';

	NS.addInit(7, () => {
		const objs = [];

		const as1 = document.querySelectorAll(SEL_TARGET + ' a');
		modifyImageAnchorStyle(as1, objs);
		const as2 = document.querySelectorAll(SEL_TARGET_IMAGE_BOX + ' a');
		modifyImageAnchorStyle(as2, objs);

		NS.onResize(() => {
			for (let obj of objs) obj.setInitialSize();
			setTimeout(() => { for (let obj of objs) obj.setInitialSize(); }, 200);
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


	function getTouchPoint(ts) {
		let x = 0, y = 0;
		if (ts.length === 1) {
			x = ts[0].pageX - window.pageXOffset;
			y = ts[0].pageY - window.pageYOffset;
		} else if (2 <= ts.length) {
			x = (ts[0].pageX + ts[1].pageX) / 2 - window.pageXOffset;
			y = (ts[0].pageY + ts[1].pageY) / 2 - window.pageYOffset;
		}
		return [x, y];
	}

	function touchDistance(ts) {
		const x1 = ts[0].screenX, y1 = ts[0].screenY;
		const x2 = ts[1].screenX, y2 = ts[1].screenY;
		return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
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

	function getCursorPoint(e) {
		return [e.pageX - window.pageXOffset, e.pageY - window.pageYOffset];
	}


	// -------------------------------------------------------------------------


	class ImageBox {

		constructor(a) {
			this._src = a.href;
			a.addEventListener('click', (e) => { this.onOpen(e); });

			this._frm = document.createElement('div');
			NS.addStile(this._frm, ST_IMAGE_BOX);
			this._frm.addEventListener('click', (e) => { this.onClose(e); });

			this._img = document.createElement('img');
			this._img.addEventListener('click', (e) => { e.stopPropagation(); });
			this._frm.appendChild(this._img);

			const btn = document.createElement('span');
			NS.addStile(btn, ST_IMAGE_BOX_CLOSE);
			this._frm.appendChild(btn);

			if (a.parentNode.tagName === 'FIGURE') {
				const fcs = a.parentNode.getElementsByTagName('figcaption');
				if (0 < fcs.length) {
					const cap = document.createElement('div');
					cap.innerHTML = fcs[0].innerHTML;
					NS.addStile(cap, ST_IMAGE_BOX_CAPTION);
					this._frm.appendChild(cap);
				}
			}
			document.body.appendChild(this._frm);

			this.enableMouseGesture();
			this.enableTouchGesture();
		}

		onOpen(e) {
			e.preventDefault();
			NS.addStile(this._frm, ST_STATE_OPEN);
			if (!this._img.src) {
				this._img.style.opacity = '0';
				this._img.src = this._src;
				this._img.addEventListener('load', () => {
					this.setInitialSize();
					this._img.style.opacity = '1';
				});
			}
			const delay = NS.BROWSER === 'ie11' ? 30 : 0;
			setTimeout(() => {
				this.setInitialSize();
				NS.addStile(this._frm, ST_STATE_VISIBLE);
			}, delay);
		}

		onClose(e) {
			e.preventDefault();
			NS.removeStile(this._frm, ST_STATE_VISIBLE);
			setTimeout(() => { NS.removeStile(this._frm, ST_STATE_OPEN); }, 200);
		}

		setInitialSize() {  // Called also when 'onResize'
			this._isPhone = NS.MEDIA_WIDTH.indexOf('phone') !== -1;
			this._scale   = 1;

			const winAs = this._frm.offsetWidth / this._frm.offsetHeight;
			const imgAs = this._img.offsetWidth / this._img.offsetHeight;
			this._isLandscape = (winAs < imgAs);

			const size = this._isPhone ? '100%' : 'calc(100% - ' + SIZE_BOX_PADDING + ')';
			if (this._isLandscape) {
				this._img.style.minWidth = '';  // To be assigned by setScale
				this._img.style.minHeight = '';
				this._img.style.width    = size;
				this._img.style.height   = 'auto';
			} else {
				this._img.style.minWidth = '';
				this._img.style.minHeight = '';  // To be assigned by setScale
				this._img.style.width     = 'auto';
				this._img.style.height    = size;
				this._img.style.maxWidth  = 'none';
			}
			this._baseSize = this._isLandscape ? this._frm.clientWidth : this._frm.clientHeight;
			this.doCenteringImage();
		}

		setScaledSize(scale) {
			this._scale = Math.max(1, Math.min(4, scale));
			let size = (this._baseSize * this._scale) + 'px';
			if (!this._isPhone) {
				size = `calc(${size} - ${SIZE_BOX_PADDING})`;
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
				[xS, yS] = getCursorPoint(e);
				isMoving = true;
			});
			this._frm.addEventListener('mousemove', (e) => {
				if (!isMoving) return;
				e.stopPropagation();
				e.preventDefault();

				const [cx, cy] = getCursorPoint(e);
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

				const [cx, cy] = getCursorPoint(e);
				const imgCx = (cx + this._frm.scrollLeft) / this._scale;
				const imgCy = (cy + this._frm.scrollTop)  / this._scale;

				const s = 0 > e.deltaY ? 1.1 : 0.9;
				this.setScaledSize(this._scale * s);

				this._frm.scrollLeft = imgCx * this._scale - cx;
				this._frm.scrollTop  = imgCy * this._scale - cy;
			}, true);
		}

		enableTouchGesture() {
			let xS = 0, yS = 0;
			let lastTouchCount = 0;
			let baseDist = 0;

			preventWindowTouchMove(this._frm);  // for Android

			this._frm.addEventListener('touchstart', (e) => {
				baseDist = 0;
				updatePoint(e.touches);
			});
			this._frm.addEventListener('touchmove', (e) => {
				e.preventDefault();
				e.stopPropagation();

				const ts = e.touches;
				if (lastTouchCount !== ts.length) updatePoint(ts);

				const [cx, cy] = getTouchPoint(ts);
				this._frm.scrollLeft += xS - cx;
				this._frm.scrollTop  += yS - cy;
				xS = cx;
				yS = cy;

				if (2 <= ts.length) {
					const imgCx = (cx + this._frm.scrollLeft) / this._scale;
					const imgCy = (cy + this._frm.scrollTop)  / this._scale;
					const dist = touchDistance(ts);

					if (baseDist) {
						const s = dist / (baseDist * this._scale);
						if (s && s !== Infinity) {
							this.setScaledSize(this._scale * s);

							this._frm.scrollLeft = imgCx * this._scale - cx;
							this._frm.scrollTop  = imgCy * this._scale - cy;
						}
					}
					baseDist = dist / this._scale;
				}
			}, { passive: false });

			function updatePoint(ts) {
				lastTouchCount = ts.length;
				[xS, yS] = getTouchPoint(ts);
			}
		}

	}

})(window.ST);
