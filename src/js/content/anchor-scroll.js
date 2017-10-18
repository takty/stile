/**
 *
 * Anchor Scroll (JS)
 *
 * @author Takuto Yanagida @ Space-Time Inc.
 * @version 2017-09-27
 *
 */


document.addEventListener('DOMContentLoaded', function () {

	var LINK_TARGET_CLASS = 'stile-link-target';

	var FIXED_ELEMENT_CLASS = 'st-fixed-element';
	var FIXED_HEIGHT_CLASS = 'st-fixed-height';
	var ADDITIONAL_OFFSET = 16;
	if (typeof STILE_ANCHOR_SCROLL_ADDITIONAL_OFFSET !== 'undefined') ADDITIONAL_OFFSET = STILE_ANCHOR_SCROLL_ADDITIONAL_OFFSET;


	// Anchor Offset -----------------------------------------------------------

	var getAnchorOffset = makeOffsetFunction(FIXED_ELEMENT_CLASS, FIXED_HEIGHT_CLASS);
	if (getAnchorOffset() !== false) {
		initTargetToStyle();
		window.addEventListener('resize', setAnchorOffset);
		setTimeout(setAnchorOffset, 100);
		if (window.location.hash) hashChanged();
	}
	window.addEventListener('hashchange', hashChanged);

	function hashChanged() {
		var hash = window.location.hash;
		if (hash[0] === '#') hash = hash.substr(1);
		var tar = document.getElementById(hash);
		if (tar) {
			setTimeout(function () {window.scrollTo(0, elementTopOnWindow(tar))}, 200);
			setTimeout(function () {window.scrollTo(0, elementTopOnWindow(tar))}, 300);
		}
	}

	function initTargetToStyle() {
		var ats = document.getElementsByClassName(LINK_TARGET_CLASS);
		for (var i = 0; i < ats.length; i += 1) {
			var at = ats[i];
			var pat = document.createElement('span');
			pat.style.display = 'inline-block';
			pat.style.position = 'absolute';
			pat.style.zIndex = -9999;
			pat.style.pointerEvents = 'none';
			pat.style.left = 0;
			pat.style.width = '100%';
			pat.id = at.id;

			at.style.position = 'relative';
			at.dataset.id = at.id;
			at.id = '';
			at.appendChild(pat);
		}
	}

	function setAnchorOffset() {
		var offset = getAnchorOffset();
		var wpabH = getWpAdminBarHeight();
		var off = offset + wpabH + ADDITIONAL_OFFSET;
		var ats = document.getElementsByClassName(LINK_TARGET_CLASS);
		var diff = false;

		for (var i = 0; i < ats.length; i += 1) {
			var at = ats[i];
			var pat = document.getElementById(at.dataset.id);
			var prevTop = parseFloat(pat.style.top);
			var newTop = -off;
			pat.style.top = newTop + 'px';
		}
		return diff;
	}


	// Smooth Scroll -----------------------------------------------------------

	var as = document.getElementsByTagName('a');

	for (var i = 0; i < as.length; i += 1) {
		var href = as[i].getAttribute('href');
		if (!href) continue;
		if (href[0] !== '#' || href === '#') {
			var pos = href.lastIndexOf('#');
			if (pos === -1) continue;
			var url = href.substr(0, pos);
			var pn = window.location.pathname;
			if (pn.lastIndexOf(url) !== pn.length - url.length) continue;

			as[i].addEventListener('click', function (e) {
				var href= e.target.getAttribute('href');
				var pos = href.lastIndexOf('#');
				href = href.substr(pos);
				jumpToHash(e, href);
			});
		} else {
			as[i].addEventListener('click', function (e) {
				var href = e.target.getAttribute('href');
				jumpToHash(e, href);
			});
		}
	}

	var isJumping;
	document.addEventListener('wheel', function () { isJumping = false; });

	function jumpToHash(e, hash) {
		var tar = false;
		if (hash === '#top' || hash === null || hash === '') {
			tar = document.documentElement;
		} else {
			tar = document.getElementById(hash.substr(1));
		}
		if (!tar) return false;
		e.stopPropagation();
		e.preventDefault();
		jump(tar, 800);
	}

	function jump(tar, duration) {
		var posY = elementTopOnWindow(tar);
		var wh = document.documentElement.offsetHeight;
		var start = window.pageYOffset;
		var timeStart, timeElapsed;

		isJumping = true;
		requestAnimationFrame(function (time) {timeStart = time; loop(time);});

		function loop(time) {
			if (!isJumping) return;
			if (wh !== document.documentElement.offsetHeight) {  // for lazy image loading
				posY = elementTopOnWindow(tar);
				wh = document.documentElement.offsetHeight;
			}
			timeElapsed = time - timeStart;
			window.scrollTo(0, easing(timeElapsed, start, posY, duration));
			if (timeElapsed < duration) requestAnimationFrame(loop)
			else end();
		}
		function end() {
			window.scrollTo(0, elementTopOnWindow(tar));
			setTimeout(function () {window.scrollTo(0, elementTopOnWindow(tar));}, 50);
			if (tar !== document.documentElement) setFocus(tar);
			isJumping = false;
		}
		function easing(t, b, c, d)  {
			t /= d / 2;
			if (t < 1) return (c - b) / 2 * t * t + b;
			t--;
			return -(c - b) / 2 * (t * (t - 2) - 1) + b;
		}
	}


	// Utilities ---------------------------------------------------------------

	function getWpAdminBarHeight() {
		if (document.body.classList.contains('chrome')) return 0;
		var wpab = document.getElementById('wpadminbar');
		return (wpab) ? wpab.clientHeight : 0;
	}

	function makeOffsetFunction(fixedElementClass, fixedHeightClass) {
		var elmFixed = document.getElementsByClassName(fixedElementClass);
		if (elmFixed && elmFixed.length > 0) {
			elmFixed = elmFixed[0];
			var elmHeight = document.getElementsByClassName(fixedHeightClass);
			if (elmHeight) elmHeight = elmHeight[0];
			else elmHeight = elmFixed;

			return function () { return elmHeight.clientHeight; };
		}
		return function () { return false; }
	}

	function elementTopOnWindow(elm) {
		var top = 0;
		while (elm) {
			top += elm.offsetTop + getTranslateY(elm);
			elm = elm.offsetParent;
		}
		return top;
	}

	function getTranslateY(elm) {
		if (!elm.style) return 0;
		var ss = elm.style.transform.split(')');
		ss.pop();
		for (var i = 0; i < ss.length; i += 1) {
			var vs = ss[i].split('(');
			var fun = vs[0].trim();
			var args = vs[1];
			switch (fun) {
			case 'translate':
				var xy = args.split(',');
				return parseFloat(xy[1] || '0');
			case 'translateY':
				return parseFloat(args);
			}
		}
		return 0;
	}

	function setFocus(tar) {
		if (!tar) return;
		if (!/^(?:a|select|input|button|textarea)$/i.test(tar.tagName)) {
			tar.tabIndex = -1;
		}
		tar.focus();
	}

});
