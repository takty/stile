/**
 *
 * Inline Style (JS)
 *
 * @author Takuto Yanagida @ Space-Time Inc.
 * @version 2019-10-28
 *
 */


window.ST = window['ST'] || {};


(function (NS) {

	const SEL_TARGET = '.stile';


	NS.addInit(1, () => {
		const spans = document.querySelectorAll(SEL_TARGET + ' span');
		modifySpanStyle(spans);
		const fs = document.querySelectorAll(SEL_TARGET + ' iframe');
		modifyIframeStyle(fs);
	});


	// Span Styles -------------------------------------------------------------


	function modifySpanStyle(spans) {
		for (let i = 0; i < spans.length; i += 1) {
			const target = spans[i];
			let type = target.style.textDecorationLine;
			if (type === undefined) {  // for IE11, Edge
				type = target.style.textDecoration;
				if (type === 'underline') {
					target.style.textDecoration = '';
					NS.addStile(target, 'inline-' + type);
				}
			} else {
				if (type === 'underline') {
					target.style.textDecorationLine = '';
					NS.addStile(target, 'inline-' + type);
				}
			}
		}
	}


	// Iframe Styles -----------------------------------------------------------


	const ifws = [];

	function modifyIframeStyle(fs) {
		for (let i = 0; i < fs.length; i += 1) {
			const f = fs[i];
			let w = f.width, h = f.height;
			if (!w || !h) {
				w = parseInt(f.style.width);
				h = parseInt(f.style.height);
				if (!w || !h) continue;
			}
			const wrap = document.createElement('SPAN');
			NS.addStile(wrap, 'iframe-wrapper');
			const spacer = document.createElement('DIV');
			spacer.style.paddingTop = (100 * h / w) + '%';
			wrap.appendChild(spacer);
			wrap.style.maxWidth = w + 'px';
			f.parentElement.insertBefore(wrap, f);
			wrap.appendChild(f);

			const a = f.getAttribute('allow');
			const as = a ? a.split(';').map((e) => e.trim()) : [];
			if (as.indexOf('fullscreen') !== -1 || f.hasAttribute('allowfullscreen')) {
				ifws.push([wrap, w / h]);
			}
		}
		if (ifws.length) NS.onResize(resizeIframeWrapper, true);
	}

	function resizeIframeWrapper() {
		const w = window.innerWidth;
		const h = window.innerHeight;

		for (let i = 0; i < ifws.length; i += 1) {
			const [wrap, as] = ifws[i];
			const fw = (h * as);
			wrap.dataset['width'] = (w < fw) ? '' : (fw + 'px');
		}
	}

})(window.ST);
