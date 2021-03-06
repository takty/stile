/**
 *
 * List Style (JS)
 *
 * @author Takuto Yanagida @ Space-Time Inc.
 * @version 2019-10-21
 *
 */


window.ST = window['ST'] || {};


(function (NS) {

	const CLS_TARGET    = 'stile';
	const ST_NO_INDENT  = 'no-indent';
	const SEL_NO_INDENT = ['td', 'th', 'blockquote', 'figcaption'];
	const SEL_NO_INDENT_CONTAINER = [
		'.column-2', '.column-3', '.column-4',
		'.card-2', '.card-3', '.card-4'
	];


	NS.addInit(3, () => {
		setStyleForInsideOf(document.getElementsByClassName(CLS_TARGET));
		setStyleDirectlyFor(document.getElementsByTagName('ul'), CLS_TARGET);
		setStyleDirectlyFor(document.getElementsByTagName('ol'), CLS_TARGET);

		const selAll = SEL_NO_INDENT.map((e) => `${e} ul, ${e} ol, ${e} dl`).join(', ');
		setStyleNoIndent(document.querySelectorAll(selAll));

		const selCon = SEL_NO_INDENT_CONTAINER.map((e) => `${e}[data-stile~='no-indent'] ul, ${e}[data-stile~='no-indent'] ol, ${e}[data-stile~='no-indent'] dl`).join(', ');
		setStyleNoIndent(document.querySelectorAll(selCon));
	});


	// -------------------------------------------------------------------------


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
				if (t.tagName === 'OL') setCounterReset(t);
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
			NS.addStile(t, 'list-' + type);
		}
	}


	// -------------------------------------------------------------------------


	function setStyleNoIndent(ts) {
		for (let i = 0; i < ts.length; i += 1) {
			const t = ts[i];
			if (!NS.containStile(t, ST_NO_INDENT)) NS.addStile(t, ST_NO_INDENT);
		}
	}


	// -------------------------------------------------------------------------


	function setCounterReset(t) {
		const cs = t.children;

		let rev = false;
		if (t.hasAttribute('reversed') || NS.containStile(t, 'reversed')) {
			let size = 0;
			for (let i = 0; i < cs.length; i += 1) {
				if (cs[i].tagName === 'LI') size += 1;
			}
			t.style.counterReset = 'li ' + (size + 1);
			rev = true;
		}

		if (t.hasAttribute('start')) {
			const s = parseInt(t.getAttribute('start'));
			t.style.counterReset = 'li ' + (s + 1);
		}

		for (let i = 0; i < cs.length; i += 1) {
			if (cs[i].tagName !== 'LI') continue;
			if (cs[i].hasAttribute('value')) {
				const s = parseInt(cs[i].getAttribute('value'));
				cs[i].style.counterReset = 'li ' + (s + (rev ? 1 : -1));
			}
		}
	}

})(window.ST);
