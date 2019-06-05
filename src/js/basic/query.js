/**
 *
 * Query Functions for Responsive and Browsers
 *
 * @author Takuto Yanagida @ Space-Time Inc.
 * @version 2019-06-05
 *
 */


window.ST = window['ST'] || {};


// -----------------------------------------------------------------------------


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
	} else if (ua.indexOf('firefox') !== -1) {
		ST.BROWSER = 'firefox';
	}
})();

ST.addInitializer(0, () => {
	const ua = window.navigator.userAgent.toLowerCase();
	const cl = document.body.classList;

	cl.add(ST.BROWSER);
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

