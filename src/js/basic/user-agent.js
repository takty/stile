/**
 *
 * User Agent
 *
 * @author Takuto Yanagida @ Space-Time Inc.
 * @version 2019-02-02
 *
 */


window.ST = window['ST'] || {};


ST.addInitializer(0, function () {

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
