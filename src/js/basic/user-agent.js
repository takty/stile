/**
 *
 * User Agent
 *
 * @author Takuto Yanagida @ Space-Time Inc.
 * @version 2018-05-24
 *
 */


let ST = ST || {};


document.addEventListener('DOMContentLoaded', function () {
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
