/**
 *
 * Content Style (JS)
 *
 * @author Takuto Yanagida @ Space-Time Inc.
 * @version 2019-06-06
 *
 */


window.ST = window['ST'] || {};


(function (NS) {

	const TARGET_SELECTOR = '.stile';


	NS.addInitializer(2, () => {
		const spans = document.querySelectorAll(TARGET_SELECTOR + ' span');
		modifySpanStyle(spans);
		const fs = document.querySelectorAll(TARGET_SELECTOR + ' iframe');
		modifyIframeStyle(fs);
		const figs = document.querySelectorAll(TARGET_SELECTOR + ' figure');
		modifyFigureStyle(figs);
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


	function modifyIframeStyle(fs) {
		for (let i = 0; i < fs.length; i += 1) {
			const f = fs[i];
			const width = f.width;
			const height = f.height;
			if (!width || !height) continue;
			const wrap = document.createElement('SPAN');
			NS.addStile(wrap, 'iframe-wrapper');
			const spacer = document.createElement('DIV');
			spacer.style.paddingTop = (100 * height / width) + '%';
			wrap.appendChild(spacer);
			wrap.style.maxWidth = width + 'px';
			f.parentElement.insertBefore(wrap, f);
			wrap.appendChild(f);
		}
	}


	// Figure Styles -----------------------------------------------------------


	function modifyFigureStyle(figs) {
		for (let i = 0; i < figs.length; i += 1) {
			figs[i].style.width = '';

			// Wrap with span for neat centering
			const fcs = figs[i].getElementsByTagName('figcaption');
			if (0 < fcs.length) {
				fcs[0].innerHTML = '<span>' + fcs[0].innerHTML + '</span>';
			}
		}
	}

})(window.ST);
