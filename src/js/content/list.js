/**
 *
 * Content Style - List (JS)
 *
 * @author Takuto Yanagida @ Space-Time Inc.
 * @version 2018-01-11
 *
 */


document.addEventListener('DOMContentLoaded', function () {

	const TARGET_CLASS = 'stile';

	setStyleForInsideOf(document.getElementsByClassName(TARGET_CLASS));
	setStyleDirectlyFor(document.getElementsByTagName('ul'), TARGET_CLASS);
	setStyleDirectlyFor(document.getElementsByTagName('ol'), TARGET_CLASS);

	function setStyleForInsideOf(ts) {
		for (let j = 0; j < ts.length; j += 1) {
			const t = ts[j];

			const uls = t.getElementsByTagName('ul');
			for (let i = 0; i < uls.length; i += 1) {
				setStyle(uls[i]);
			}
			const ols = t.getElementsByTagName('ol');
			for (let i = 0; i < ols.length; i += 1) {
				setStyle(ols[i]);
			}
		}
	}

	function setStyleDirectlyFor(ts, tc) {
		for (let i = 0; i < ts.length; i += 1) {
			const t = ts[i];
			if (!t.dataset.listStyleType && t.classList.contains(tc)) {
				setStyle(t);
			}
		}
	}

	function setStyle(t) {
		const type = t.style.listStyleType;
		if (type !== '' && type !== 'none') {
			t.style.listStyleType = '';
			t.dataset.listStyleType = type;
		}
	}

});
