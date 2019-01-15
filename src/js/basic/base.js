/**
 *
 * Base Functions
 *
 * @author Takuto Yanagida @ Space-Time Inc.
 * @version 2019-01-15
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


// -----------------------------------------------------------------------------


const _initializer = [[], [], [], [], [], [], [], []];

document.addEventListener('DOMContentLoaded', function () {
	for (let i = 0; i < _initializer.length; i += 1) {
		const is = _initializer[i];
		for (let j = 0; j < is.length; j += 1) is[j]();
	}
});

ST.addInitializer = function (level, fn) {
	_initializer[level].push(fn);
}


// -----------------------------------------------------------------------------


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


ST.elementTopOnWindow = function (elm) {
	const br = elm.getBoundingClientRect();
	return br.top + window.pageYOffset;
};

ST.elementLeftOnWindow = function (elm) {
	const br = elm.getBoundingClientRect();
	return br.left + window.pageXOffset;
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
};

ST.getWpAdminBarHeight = function () {
	const wpab = document.getElementById('wpadminbar');
	return (wpab && getComputedStyle(wpab).position === 'fixed') ? wpab.offsetHeight : 0;
};
