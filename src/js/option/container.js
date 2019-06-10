/**
 *
 * Container Classes (JS)
 *
 * @author Takuto Yanagida @ Space-Time Inc.
 * @version 2019-06-10
 *
 */


window.ST = window['ST'] || {};


(function (NS) {

	const TARGET_SELECTOR = '.stile';

	NS.addInitializer(1, () => {
		let cs = document.querySelectorAll(TARGET_SELECTOR + ' .card-3');
		for (let i = 0; i < cs.length; i += 1) modifyCardStyle(cs[i], 3);
		cs = document.querySelectorAll(TARGET_SELECTOR + ' .card-4');
		for (let i = 0; i < cs.length; i += 1) modifyCardStyle(cs[i], 4);
	});


	// Card --------------------------------------------------------------------


	function modifyCardStyle(a, col) {
		const cs = a.childNodes;
		if (cs.length === 0) return false;

		const parentTN = a.tagName;
		let childTN = 'DIV';
		switch (parentTN) {
			case 'UL':
			case 'OL':
				childTN = 'LI';
		}
		for (let i = 0; i < col - 1; i += 1) {
			const e = document.createElement(childTN);
			a.appendChild(e);
		}
		return true;
	}

})(window.ST);
