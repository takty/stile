/**
 *
 * User Agent
 *
 * @author Takuto Yanagida @ Space-Time Inc.
 * @version 2018-01-24
 *
 */


document.addEventListener('DOMContentLoaded', function () {
	const ua = window.navigator.userAgent.toLowerCase();
	const cl = document.body.classList;

	if (ua.indexOf('edge') !== -1) {
		cl.add('edge');
	} else if (ua.indexOf('trident/7') !== -1) {
		cl.add('ie11');
	} else if (ua.indexOf('chrome')  !== -1 && ua.indexOf('edge') === -1) {
		cl.add('chrome');
	} else if (ua.indexOf('safari')  !== -1 && ua.indexOf('chrome') === -1) {
		cl.add('safari');
	} else if (ua.indexOf('opera')   !== -1) {
		cl.add('opera');
	} else if (ua.indexOf('firefox') !== -1) {
		cl.add('firefox');
	}
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
