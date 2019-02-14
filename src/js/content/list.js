/**
 *
 * List Style (JS)
 *
 * @author Takuto Yanagida @ Space-Time Inc.
 * @version 2019-02-14
 *
 */


window.ST = window['ST'] || {};


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
				setCounterReset(ols[i]);
			}
		}
	}

	function setStyleDirectlyFor(ts, tc) {
		for (let i = 0; i < ts.length; i += 1) {
			const t = ts[i];
			if (!hasListStile(t) && t.classList.contains(tc)) {
				setStyle(t);
				if (t.tagName === 'OL') setCounterReset(ols[i]);
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

	function setCounterReset(t) {
		const v = t.getAttribute('start');
		if (v !== null && v !== '') {
			const s = parseInt(v);
			t.style.counterReset = 'li ' + (s + 1);
		}
		const cs = t.children;

		let rev = false;
		if (t.getAttribute('reversed') !== null) {
			let size = 0;
			for (let i = 0; i < cs.length; i += 1) {
				if (cs[i].tagName === 'LI') size += 1;
			}
			t.style.counterReset = 'li ' + (size + 1);
			rev = true;
		}
		for (let i = 0; i < cs.length; i += 1) {
			if (cs[i].tagName !== 'LI') continue;
			const v = cs[i].getAttribute('value');
			if (v !== null && v !== '') {
				const s = parseInt(v);
				cs[i].style.counterReset = 'li ' + (s + (rev ? 1 : -1));
			}
		}
	}

});
