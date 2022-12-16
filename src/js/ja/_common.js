/**
 *
 * Common Functions
 *
 * @author Takuto Yanagida
 * @version 2021-11-03
 *
 */


function removeHeadWhiteSpaces(str) {
	const mzs = str.match(/^[\n\r\t ]*(\u3000*)/);
	const zs = (mzs && 1 < mzs.length) ? mzs[1] : '';
	return zs + str.replace(/^\s+/g, '');  // Trim left
}

function removeTailWhiteSpaces(str) {
	return str.replace(/\s+$/g, '');  // Trim right
}

function removeWhiteSpacesBetweenZenChars(str) {
	// White space character class excluding \u3000
	// [ \f\n\r\t\v​\u00a0​\u180e\u2000​-\u200a​\u2028\u2029\u202f\u205f​\ufeff]
	return str.replace(/([^\x01-\x7E\xA1-\xDF]+)([\t\n]+|[ \f\n\r\t\v\u00a0\u180e\u2000-\u200a\u2028\u2029\u202f\u205f\ufeff]{2})([^\x01-\x7E\xA1-\xDF]+)/g, (match, g1, d, g2) => g1 + g2);
}
