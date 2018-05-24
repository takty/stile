/**
 *
 * Segmenter
 *
 * @author Takuto Yanagida @ Space-Time Inc.
 * @version 2018-05-25
 *
 */


document.addEventListener('DOMContentLoaded', function () {

	const TARGET_SELECTOR = '.stile';
	const TARGET_SELECTOR_SEGMENTER = '.stile-segmenter';

	for (let i = 1; i <= 6; i += 1) {
		let ts = document.querySelectorAll(TARGET_SELECTOR + ' h' + i + ':not([class])');
		for (let i = 0; i < ts.length; i += 1) applySeparaterToElement(ts[i]);
	}
	let ts = document.querySelectorAll(TARGET_SELECTOR_SEGMENTER);
	for (let i = 0; i < ts.length; i += 1) applySeparaterToElement(ts[i]);


	// -------------------------------------------------------------------------

	function applySeparaterToElement(elm) {
		elm.innerHTML = separateTextAndMakeSpans(elm.innerText);
	}

	function separateTextAndMakeSpans(text) {
		const pair = {'S*': 1, '*E': 1, 'II': 1, 'KK': 1, 'HH': 1, 'HI': 1};
		const parts = [];
		let t_prev = '';
		let word = '';

		for (let i = 0, I = text.length; i < I; i += 1) {
			const c = text.substr(i, 1);
			const t = getCtype(c);
			if (pair[t_prev + t] || pair['*' + t] || pair[t_prev + '*']) {
				word += c;
			} else if (t === 'O') {
				if (t_prev === 'O') {
					word += c;
				} else {
					if (0 < word.length) parts.push([word, true]);
					word = c;
				}
			} else {
				if (0 < word.length) parts.push([word, (t_prev !== 'O')]);
				word = c;
			}
			t_prev = t;
		}
		if (0 < word.length) parts.push([word, (t_prev !== 'O')]);

		let ret = '';
		for (let i = 0, I = parts.length; i < I; i += 1) {
			const ws = parts[i];
			ret += (ws[1]) ? ('<span>' + ws[0] + '</span>') : ws[0];
		}
		return ret;
	}

	function getCtype(c) {
		const types = ['S', 'E', 'I', 'K', 'H'];
		const pats = {
			S: /[「『（［｛〈《【〔]/u,
			E: /[」』）］｝〉》】〕、，。．？]/u,
			I: /[ぁ-ん]/u,
			K: /[ァ-ヴーｱ-ﾝﾞｰ]/u,
			H: /[一-龠々〆ヵヶ]/u
		};
		for (let i = 0; i < types.length; i += 1) {
			const t = types[i];
			const p = pats[t];
			if (p.test(c)) return t;
		}
		return 'O';
	}

});
