/**
 *
 * User Agent
 *
 * @author Takuto Yanagida @ Space-Time Inc.
 * @version 2018-05-23
 *
 */


const STILE = STILE || {};

STILE.addDataStile = function (elm, style) {
	if (elm.dataset.stile) {
		const ssl = ' ' + elm.dataset.stile + ' ';
		const sbb = ' ' + style + ' ';
		if (ssl.indexOf(sbb) !== -1) return;
		elm.dataset.stile = elm.dataset.stile + ' ' + style;
	} else {
		elm.dataset.stile = style;
	}
	elm.className = elm.className;  // Hack for IE11
};

STILE.containStile = function (elm, style) {
	if (!elm.dataset.stile) return false;
	const ssl = ' ' + elm.dataset.stile + ' ';
	const sbb = ' ' + style + ' ';
	return (ssl.indexOf(sbb) !== -1);
};

STILE.removeDataStile = function (elm, style) {
	if (!elm.dataset.stile) return;
	const ssl = ' ' + elm.dataset.stile + ' ';
	const sbb = ' ' + style + ' ';
	elm.dataset.stile = (ssl.replace(sbb, ' ')).trim();
	elm.className = elm.className;  // Hack for IE11
};
