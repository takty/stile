/**
 *
 * Image Box (JS)
 *
 * @author Takuto Yanagida @ Space-Time Inc.
 * @version 2019-02-02
 *
 */


window.ST = window['ST'] || {};


ST.addInitializer(7, function () {

	const WIN_SIZE_RESPONSIVE       = 600
	const TARGET_SELECTOR           = '.stile';
	const TARGET_SELECTOR_IMAGE_BOX = '.stile-image-box';
	const STILE_CLS_IMAGE_BOX       = 'image-box';
	const STILE_STATE_OPEN          = 'open';
	const STILE_STATE_VISIBLE       = 'visible';
	const SIZE_BOX_PADDING          = '4rem';

	let as = document.querySelectorAll(TARGET_SELECTOR + ' a');
	modifyImageAnchorStyle(as);
	as = document.querySelectorAll(TARGET_SELECTOR_IMAGE_BOX + ' a');
	modifyImageAnchorStyle(as);

	function modifyImageAnchorStyle(as) {
		const fas = filterImageLink(as);
		for (let i = 0; i < fas.length; i += 1) {
			createBox(fas[i]);
		}
	}

	function filterImageLink(as) {
		const ret = [];
		for (let i = 0; i < as.length; i += 1) {
			const a = as[i];
			if (!ST.containStile(a, 'link-image')) continue;
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
				return true;
		}
		return false;
	}

	function createBox(a) {
		const frame = document.createElement('div');
		ST.addStile(frame, STILE_CLS_IMAGE_BOX);
		const img = document.createElement('img');
		img.src = a.href;
		frame.appendChild(img);
		const closeBtn = document.createElement('span');
		frame.appendChild(closeBtn);
		document.body.appendChild(frame);

		a.addEventListener('click', function (e) { onOpen(e, frame, img); });
		frame.addEventListener('click', function (e) { onClose(e, frame); });
		enableTouchGesture(frame, img);

		img.addEventListener('click', function (e) { e.stopPropagation(); });
		frame.addEventListener('mousewheel', function (e) { e.preventDefault(); });
		return frame;
	}

	function onOpen(e, frame, img) {
		e.preventDefault();
		ST.addStile(frame, STILE_STATE_OPEN);
		const isPhone = window.innerWidth < WIN_SIZE_RESPONSIVE;
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
		const delay = ST.BROWSER === 'ie11' ? 30 : 0;
		setTimeout(function () { ST.addStile(frame, STILE_STATE_VISIBLE); }, delay);
	}

	function onClose(e, frame) {
		e.preventDefault();
		ST.removeStile(frame, STILE_STATE_VISIBLE);
		setTimeout(function () { ST.removeStile(frame, STILE_STATE_OPEN); }, 200);
	}

	function enableTouchGesture(frame, img) {
		let isLandscape = true;
		let baseDist = 0;
		let scale = 1;
		let tid;
		let xS = 0, yS = 0;
		let isMoving = false;

		frame.addEventListener('touchstart', function (e) {
			isLandscape = checkLandscape(frame, img);
			baseDist = 0;
			if (!img.style.minWidth && !img.style.minHeight) scale = 1;
			if (e.touches.length === 1) {
				isMoving = true;
				xS = e.touches[0].screenX + frame.scrollLeft;
				yS = e.touches[0].screenY + frame.scrollTop;
			}
		}, true);
		frame.addEventListener('touchmove', function (e) {
			e.stopPropagation();
			e.preventDefault();

			frame.style.overflow = 'scroll';
			const ts = e.changedTouches;

			if (ts.length === 1 && isMoving) {
				frame.scrollLeft = xS - ts[0].screenX;
				frame.scrollTop  = yS - ts[0].screenY;
			} else if (ts.length > 1) {
				isMoving = false;
				const baseSize = isLandscape ? frame.clientWidth : frame.clientHeight;
				const dist = touchDistance(ts);
				const scx = (ts[0].screenX + ts[1].screenX) / 2;
				const scy = (ts[0].screenY + ts[1].screenY) / 2;
				const imgCx = (scx + frame.scrollLeft) / scale;
				const imgCy = (scy + frame.scrollTop)  / scale;

				clearTimeout(tid);

				if (baseDist) {
					const s = dist / (baseDist * scale);
					if (s && s !== Infinity) {
						scale *= s;
						scale = Math.min(4, scale);
						scale = Math.max(1, scale);
						if (isLandscape) {
							img.style.minWidth = (baseSize * scale) + 'px';
						} else {
							img.style.minHeight = (baseSize * scale) + 'px';
						}
						centeringImage(frame, img);

						frame.scrollLeft = imgCx * scale - scx;
						frame.scrollTop  = imgCy * scale - scy;
					}
					tid = setTimeout(function () { baseDist = 0; }, 100);
				} else {
					baseDist = dist / scale;
				}
			}
		}, true);
	}

	function checkLandscape(frame, img) {
		const winAspect = frame.offsetWidth / frame.offsetHeight;
		const imgAspect = img.offsetWidth / img.offsetHeight;
		return (winAspect < imgAspect);
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

	function touchDistance(ts) {
		const x1 = ts[0].screenX;
		const y1 = ts[0].screenY;
		const x2 = ts[1].screenX;
		const y2 = ts[1].screenY;
		return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
	}

});
