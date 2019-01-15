/**
 *
 * List Style (JS)
 *
 * @author Takuto Yanagida @ Space-Time Inc.
 * @version 2019-01-15
 *
 */


let ST = ST || {};


ST.addInitializer(4, function () {

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
			if (!hasListStile(t) && t.classList.contains(tc)) {
				setStyle(t);
			}
		}
	}

	function hasListStile(elm) {
		const stile = elm.dataset['stile'];
		if (!stile) return false;
		const ats = stile.split(' ');
		for (let i = 0; i < ats.length; i += 1) {
			const at = ats[i];
			if(at.indexOf('list-') === 0) return true;
		}
		return false;
	}

	function setStyle(t) {
		const type = t.style.listStyleType;
		if (type !== '' && type !== 'none') {
			t.style.listStyleType = '';
			ST.addStile(t, 'list-' + type);
		}
	}

});
