/**
 *
 * User Agent
 *
 * @author Takuto Yanagida @ Space-Time Inc.
 * @version 2018-05-24
 *
 */


let ST = ST || {};

(function () {
	const ua = window.navigator.userAgent.toLowerCase();
	if (ua.indexOf('edge') !== -1) {
		ST.BROWSER = 'edge';
	} else if (ua.indexOf('trident/7') !== -1) {
		ST.BROWSER = 'ie11';
	} else if (ua.indexOf('chrome') !== -1 && ua.indexOf('edge') === -1) {
		ST.BROWSER = 'chrome';
	} else if (ua.indexOf('safari') !== -1 && ua.indexOf('chrome') === -1) {
		ST.BROWSER = 'safari';
	} else if (ua.indexOf('opera') !== -1) {
		ST.BROWSER = 'opera';
	} else if (ua.indexOf('firefox') !== -1) {
		ST.BROWSER = 'firefox';
	}
})();

ST.addStile = function (elm, style) {
	if (elm.dataset.stile) {
		const ssl = ' ' + elm.dataset.stile + ' ';
		const sbb = ' ' + style + ' ';
		if (ssl.indexOf(sbb) !== -1) return;
		elm.dataset.stile = elm.dataset.stile + ' ' + style;
	} else {
		elm.dataset.stile = style;
	}
	elm.className = elm.className;  // Hack for IE11
	if (!elm.className) elm.removeAttribute('class');
};

ST.containStile = function (elm, style) {
	if (!elm.dataset.stile) return false;
	const ssl = ' ' + elm.dataset.stile + ' ';
	const sbb = ' ' + style + ' ';
	return (ssl.indexOf(sbb) !== -1);
};

ST.removeStile = function (elm, style) {
	if (!elm.dataset.stile) return;
	const ssl = ' ' + elm.dataset.stile + ' ';
	const sbb = ' ' + style + ' ';
	elm.dataset.stile = (ssl.replace(sbb, ' ')).trim();
	elm.className = elm.className;  // Hack for IE11
	if (!elm.className) elm.removeAttribute('class');
};


// -----------------------------------------------------------------------------

ST.elementTopOnWindow = function (elm, considerTranslate = false) {
	let top = 0;
	if (considerTranslate) {
		while (elm) {
			top += elm.offsetTop + ST.getTranslateY(elm);
			elm = elm.offsetParent;
		}
	} else {
		while (elm) {
			top += elm.offsetTop;
			elm = elm.offsetParent;
		}
	}
	return top;
};

ST.getTranslateY = function (elm) {
	if (!elm.style) return 0;
	const ss = elm.style.transform.split(')');
	ss.pop();
	for (let i = 0; i < ss.length; i += 1) {
		const vs = ss[i].split('(');
		const fun = vs[0].trim();
		const args = vs[1];
		switch (fun) {
			case 'translate':
				return parseFloat(args.split(',')[1] || '0');
			case 'translateY':
				return parseFloat(args);
		}
	}
	return 0;
};


// -----------------------------------------------------------------------------

ST.makeOffsetFunction = function (fixedElementClass, fixedTopClass) {
	let elmFixed = document.getElementsByClassName(fixedElementClass);
	if (elmFixed && elmFixed.length > 0) {
		elmFixed = elmFixed[0];
		let elmTops = document.getElementsByClassName(fixedTopClass);
		if (elmTops) {
			return function () {
				const pos = getComputedStyle(elmFixed).position;
				if (pos === 'fixed') {
					let height = 0;
					for (let i = 0; i < elmTops.length; i += 1) height += elmTops[i].offsetHeight;
					return height;
				}
				return 0;
			};
		}
		return function () {
			const pos = getComputedStyle(elmFixed).position;
			return pos === 'fixed' ? elmFixed.offsetHeight : 0;
		};
	}
	return function () { return 0; }
}

ST.getWpAdminBarHeight = function () {
	if (ST.BROWSER === 'chrome') return 0;
	const wpab = document.getElementById('wpadminbar');
	return (wpab && getComputedStyle(wpab).position === 'fixed') ? wpab.offsetHeight : 0;
};

