/**
 *
 * Content Style - List (JS)
 *
 * @author Takuto Yanagida @ Space-Time Inc.
 * @version 2017-08-16
 *
 */


document.addEventListener('DOMContentLoaded', function () {

	var TARGET_CLASS = 'stile';

	setStyleForInsideOf(document.getElementsByClassName(TARGET_CLASS));
	setStyleDirectlyFor(document.getElementsByTagName('ul'), TARGET_CLASS);
	setStyleDirectlyFor(document.getElementsByTagName('ol'), TARGET_CLASS);

	function setStyleForInsideOf(ts) {
		for (var j = 0; j < ts.length; j += 1) {
			var t = ts[j];

			var uls = t.getElementsByTagName('ul');
			for (var i = 0; i < uls.length; i += 1) {
				setStyle(uls[i]);
			}
			var ols = t.getElementsByTagName('ol');
			for (var i = 0; i < ols.length; i += 1) {
				setStyle(ols[i]);
			}
		}
	}

	function setStyleDirectlyFor(ts, tc) {
		for (var i = 0; i < ts.length; i += 1) {
			var t = ts[i];
			if (!t.dataset.listStyleType && t.classList.contains(tc)) {
				setStyle(t);
			}
		}
	}

	function setStyle(t) {
		var type = t.style.listStyleType;
		if (type !== '' && type !== 'none') {
			t.style.listStyleType = '';
			t.dataset.listStyleType = type;
		}
	}

});
