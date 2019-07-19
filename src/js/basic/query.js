/**
 *
 * Query Functions for Responsive and Browsers (JS)
 *
 * @author Takuto Yanagida @ Space-Time Inc.
 * @version 2019-07-19
 *
 */


window.ST = window['ST'] || {};


(function (NS) {

	// eslint-disable-next-line func-style
	const assignWindowSize = () => {
		const w = window.innerWidth;
		if (w < 480) {
			NS.MEDIA_WIDTH = 'phone-portrait';
		} else if (w < 600) {
			NS.MEDIA_WIDTH = 'phone-landscape';
		} else if (w < 900) {
			NS.MEDIA_WIDTH = 'tablet-portrait';
		} else if (w < 1200) {
			NS.MEDIA_WIDTH = 'tablet-landscape';
		} else if (w < 1800) {
			NS.MEDIA_WIDTH = 'desktop';
		} else {
			NS.MEDIA_WIDTH = 'big-desktop';
		}
		const h = window.innerHeight;
		if (h < 600) {
			NS.MEDIA_HEIGHT = 'tiny';
		} else if (h < 950) {
			NS.MEDIA_HEIGHT = 'small';
		} else if (h < 1200) {
			NS.MEDIA_HEIGHT = 'medium';
		} else {
			NS.MEDIA_HEIGHT = 'large';
		}
	};

	NS.onResize(assignWindowSize, true);


	// -------------------------------------------------------------------------


	const ua = window.navigator.userAgent.toLowerCase();
	if (ua.indexOf('edge') !== -1) {
		NS.BROWSER = 'edge';
	} else if (ua.indexOf('trident/7') !== -1) {
		NS.BROWSER = 'ie11';
	} else if (ua.indexOf('chrome') !== -1 && ua.indexOf('edge') === -1) {
		NS.BROWSER = 'chrome';
	} else if (ua.indexOf('safari') !== -1 && ua.indexOf('chrome') === -1) {
		NS.BROWSER = 'safari';
	} else if (ua.indexOf('firefox') !== -1) {
		NS.BROWSER = 'firefox';
	}

	NS.addInit(0, () => {
		const ua = window.navigator.userAgent.toLowerCase();
		const cl = document.body.classList;

		cl.add(NS.BROWSER);
		if (ua.indexOf('iphone') !== -1) {
			cl.add('iphone');
			cl.add('ios');
		}
		if (ua.indexOf('ipad') !== -1) {
			cl.add('ipad');
			cl.add('ios');
		}
		if (ua.indexOf('android') !== -1) {
			cl.add('android');
		}
	});

})(window.ST);
