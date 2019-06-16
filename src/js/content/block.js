/**
 *
 * Block Style (JS)
 *
 * @author Takuto Yanagida @ Space-Time Inc.
 * @version 2019-06-16
 *
 */


window.ST = window['ST'] || {};


(function (NS) {

	const SEL_TARGET = '.stile';


	NS.addInit(2, () => {
		const fs = document.querySelectorAll(SEL_TARGET + ' iframe');
		modifyIframeStyle(fs);
		const figs = document.querySelectorAll(SEL_TARGET + ' figure');
		modifyFigureStyle(figs);
	});


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
