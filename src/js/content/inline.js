/**
 *
 * Inline Style (JS)
 *
 * @author Takuto Yanagida @ Space-Time Inc.
 * @version 2019-06-16
 *
 */


window.ST = window['ST'] || {};


(function (NS) {

	const SEL_TARGET = '.stile';


	NS.addInit(2, () => {
		const spans = document.querySelectorAll(SEL_TARGET + ' span');
		modifySpanStyle(spans);
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

})(window.ST);
