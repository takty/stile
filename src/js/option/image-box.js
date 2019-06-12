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
		const as1 = document.querySelectorAll(TARGET_SELECTOR + ' a');
		modifyImageAnchorStyle(as1);
		const as2 = document.querySelectorAll(TARGET_SELECTOR_IMAGE_BOX + ' a');
		modifyImageAnchorStyle(as2);
	});

	function modifyImageAnchorStyle(as) {
		const fas = filterImageLink(as);
		// for (let i = 0; i < fas.length; i += 1) createBox(fas[i]);
		for (let i = 0; i < fas.length; i += 1) {
			const ib = new ImageBox(fas[i]);
		}
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

	function createBox(a) {
		const frame = document.createElement('div');
		NS.addStile(frame, STILE_CLS_IMAGE_BOX);
		const img = document.createElement('img');
		const src = a.href;
		frame.appendChild(img);
		const closeBtn = document.createElement('span');
		NS.addStile(closeBtn, STILE_CLS_IMAGE_BOX_CLOSE);
		frame.appendChild(closeBtn);

		if (a.parentNode.tagName === 'FIGURE') {
			const cs = a.parentNode.getElementsByTagName('figcaption');
			if (0 < cs.length) {
				const captInner = cs[0].innerHTML;
				const capt = document.createElement('div');
				capt.innerHTML = captInner;
				NS.addStile(capt, STILE_CLS_IMAGE_BOX_CAPTION);
				frame.appendChild(capt);
			}
		}
		document.body.appendChild(frame);

		a.addEventListener('click', (e) => { onOpen(e, frame, img, src); });
		frame.addEventListener('click', (e) => { onClose(e, frame); });
		enableTouchGesture(frame, img);

		img.addEventListener('click', (e) => { e.stopPropagation(); });
		enableMouseGesture(frame, img);

		NS.onResize(() => { setTimeout(() => { centeringImage(frame, img); }, 200); });
		return frame;
	}

	function onOpen(e, frame, img, src) {
		e.preventDefault();
		NS.addStile(frame, STILE_STATE_OPEN);
		if (!img.src) {
			img.style.opacity = '0';
			img.src = src;
			img.addEventListener('load', () => {
				initImageSize(frame, img);
				img.style.opacity = '1';
			});
		}
		const delay = NS.BROWSER === 'ie11' ? 30 : 0;
		setTimeout(() => { NS.addStile(frame, STILE_STATE_VISIBLE); }, delay);
	}

	function initImageSize(frame, img) {
		const isPhone = NS.MEDIA_WIDTH.indexOf('phone') !== -1;
		if (checkLandscape(frame, img)) {
			img.style.minWidth = '';
			img.style.width = isPhone ? '100%' : 'calc(100% - ' + SIZE_BOX_PADDING + ')';
			img.style.height = 'auto';
		} else {
			img.style.minHeight = '';
			img.style.width = 'auto';
			img.style.maxWidth = 'none';
			img.style.height = isPhone ? '100%' : 'calc(100% - ' + SIZE_BOX_PADDING + ')';
		}
		centeringImage(frame, img);
	}

	function onClose(e, frame) {
		e.preventDefault();
		NS.removeStile(frame, STILE_STATE_VISIBLE);
		setTimeout(() => { NS.removeStile(frame, STILE_STATE_OPEN); }, 200);
	}

	function enableTouchGesture(frame, img) {
		let isLandscape = true;
		let baseDist = 0;
		let scale = 1;
		const isPhone = NS.MEDIA_WIDTH.indexOf('phone') !== -1;

		let xS = 0, yS = 0;
		let lastTouchCount = 0;

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

		frame.addEventListener('touchstart', (e) => {
			isLandscape = checkLandscape(frame, img);
			baseDist = 0;
			if (!img.style.minWidth && !img.style.minHeight) scale = 1;

			updatePoint(e.touches);
		});
		frame.addEventListener('touchmove', (e) => {
			e.preventDefault();
			e.stopPropagation();

			frame.style.overflow = 'hidden';
			const ts = e.touches;
			if (lastTouchCount !== ts.length) updatePoint(ts);

			if (ts.length === 1) {
				const cx = ts[0].pageX - window.pageXOffset;
				const cy = ts[0].pageY - window.pageYOffset;
				frame.scrollLeft += xS - cx;
				frame.scrollTop  += yS - cy;
				xS = cx;
				yS = cy;
			} else if (ts.length > 1) {
				const baseSize = isLandscape ? frame.clientWidth : frame.clientHeight;
				const dist = touchDistance(ts);

				const scx = (ts[0].pageX + ts[1].pageX) / 2 - window.pageXOffset;
				const scy = (ts[0].pageY + ts[1].pageY) / 2 - window.pageYOffset;
				frame.scrollLeft += xS - scx;
				frame.scrollTop  += yS - scy;
				xS = scx;
				yS = scy;

				const imgCx = (scx + frame.scrollLeft) / scale;
				const imgCy = (scy + frame.scrollTop)  / scale;

				if (baseDist) {
					const s = dist / (baseDist * scale);
					if (s && s !== Infinity) {
						scale = setImageScale(img, baseSize, scale * s, isLandscape, isPhone);
						centeringImage(frame, img);

						frame.scrollLeft = imgCx * scale - scx;// + dx;
						frame.scrollTop  = imgCy * scale - scy;// + dy;
					}
				}
				baseDist = dist / scale;
			}
		}, { passive: false });

		// for Android
		preventWindowTouchMove(frame);
	}

	function enableMouseGesture(frame, img) {
		let isLandscape = true;
		let scale = 1;
		let xS = 0, yS = 0;
		let isMoving = false;
		const isPhone = NS.MEDIA_WIDTH.indexOf('phone') !== -1;

		frame.addEventListener('mousedown', (e) => {
			xS = e.pageX - window.pageXOffset;
			yS = e.pageY - window.pageYOffset;
			isMoving = true;
			e.preventDefault();
		});
		frame.addEventListener('mousemove', (e) => {
			if (isMoving) {
				e.stopPropagation();
				e.preventDefault();
				frame.style.overflow = 'hidden';
				const cx = e.pageX - window.pageXOffset;
				const cy = e.pageY - window.pageYOffset;
				frame.scrollLeft += xS - cx;
				frame.scrollTop  += yS - cy;
				xS = cx;
				yS = cy;
			}
		});
		frame.addEventListener('mousedrag', (e) => {  // for Firefox
			if (isMoving) {
				e.stopPropagation();
				e.preventDefault();
			}
		});
		frame.addEventListener('mouseup', () => { isMoving = false; });

		frame.addEventListener('wheel', (e) => {
			e.stopPropagation();
			e.preventDefault();

			frame.style.overflow = 'hidden';
			isLandscape = checkLandscape(frame, img);
			const baseSize = isLandscape ? frame.clientWidth : frame.clientHeight;
			if (!img.style.minWidth && !img.style.minHeight) scale = 1;

			const scx = e.pageX - window.pageXOffset;
			const scy = e.pageY - window.pageYOffset;
			const imgCx = (scx + frame.scrollLeft) / scale;
			const imgCy = (scy + frame.scrollTop) / scale;

			const s = 0 > e.deltaY ? 1.1 : 0.9;
			scale = setImageScale(img, baseSize, scale * s, isLandscape, isPhone);
			centeringImage(frame, img);

			frame.scrollLeft = imgCx * scale - scx;
			frame.scrollTop  = imgCy * scale - scy;
		}, true);
	}

	function checkLandscape(frame, img) {
		const winAspect = frame.offsetWidth / frame.offsetHeight;
		const imgAspect = img.offsetWidth / img.offsetHeight;
		return (winAspect < imgAspect);
	}

	function setImageScale(img, baseSize, scale, isLandscape, isPhone) {
		scale = Math.max(1, Math.min(4, scale));
		let size = '';
		if (isPhone) {
			size = (baseSize * scale) + 'px';
		} else {
			size = 'calc(' + (baseSize * scale) + 'px - ' + SIZE_BOX_PADDING + ')';
		}
		if (isLandscape) img.style.minWidth = size;
		else img.style.minHeight = size;
		return scale;
	}

	function centeringImage(frame, img) {
		if (img.offsetWidth < frame.offsetWidth) {
			img.style.left = ((frame.offsetWidth - img.offsetWidth) / 2) + 'px';
		} else {
			img.style.left = 0;
		}
		if (img.offsetHeight < frame.offsetHeight) {
			img.style.top = ((frame.offsetHeight - img.offsetHeight) / 2) + 'px';
		} else {
			img.style.top = 0;
		}
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

	function touchDistance(ts) {
		const x1 = ts[0].screenX;
		const y1 = ts[0].screenY;
		const x2 = ts[1].screenX;
		const y2 = ts[1].screenY;
		return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
	}

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
			NS.onResize(() => {
				this.setInitialSize();
				setTimeout(() => { this.setInitialSize(); }, 200);
			});
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

		setInitialSize() {
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
