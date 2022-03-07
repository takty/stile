/**
 *
 * Inner
 *
 * @author Takuto Yanagida
 * @version 2021-11-25
 *
 */


function getBreakPointSize() {
	let bpW, bpH;

	const w = window.innerWidth;
	if (w < 450) {
		bpW = 'phone-portrait';
	} else if (w < 600) {
		bpW = 'phone-landscape';
	} else if (w < 900) {
		bpW = 'tablet-portrait';
	} else if (w < 1200) {
		bpW = 'tablet-landscape';
	} else if (w < 1500) {
		bpW = 'desktop';
	} else {
		bpW = 'big-desktop';
	}
	const h = window.innerHeight;
	if (h < 700) {
		bpH = 'tiny';
	} else if (h < 800) {
		bpH = 'small';
	} else if (h < 900) {
		bpH = 'medium';
	} else {
		bpH = 'large';
	}
	return [bpW, bpH];
}


// -----------------------------------------------------------------------------


function getBrowser() {
	const ua = window.navigator.userAgent.toLowerCase();
	if (ua.includes('chrome')) {  // UA includes 'safari'.
		return 'chrome';
	}
	if (ua.includes('safari')) {
		return 'safari';
	}
	if (ua.includes('firefox')) {
		return 'firefox';
	}
}

function getDevice() {
	const ua = window.navigator.userAgent.toLowerCase();

	const ret = [];
	if (ua.includes('android')) {
		ret.push('android');
	}
	if (ua.includes('iphone')) {
		ret.push('ios');
		ret.push('iphone');
	} else if (ua.includes('ipad')) {
		ret.push('ios');
		ret.push('ipad');
	} else if (ua.includes('safari') && !ua.includes('chrome') && 'ontouchend' in document) {
		ret.push('ios');
		ret.push('ipad');
		ret.push('ipad-desktop');
	}
	if (!ret.length) {
		ret.push('desktop');
	}
	return ret;
}
