/**
 *
 * Block Style (JS)
 *
 * @author Takuto Yanagida @ Space-Time Inc.
 * @version 2019-06-19
 *
 */


window.ST = window['ST'] || {};


(function (NS) {

	const SEL_TARGET = '.stile';


	NS.addInit(3, () => {
		const figs = document.querySelectorAll(SEL_TARGET + ' figure');
		modifyFigureStyle(figs);
	});


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
