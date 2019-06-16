/**
 *
 * Japanese Text Segmenter
 *
 * @author Takuto Yanagida @ Space-Time Inc.
 * @version 2019-06-16
 *
 */


window.ST = window['ST'] || {};


(function (NS) {

	const SEL_TARGET = '.stile';
	const SEL_TARGET_SEGMENTER = '.stile-segmenter';

	const CTYPES = ['S', 'E', 'I', 'K', 'H'];
	const CPATS = {
		S: /[「『（［｛〈《【〔〖〘〚＜]/u,
		E: /[」』）］｝〉》】〕〗〙〛＞、，。．？！を：]/u,
		I: /[ぁ-んゝ]/u,
		K: /[ァ-ヴーｱ-ﾝﾞｰ]/u,
		H: /[一-龠々〆ヵヶ]/u
	};
	const PAIRS = { 'S*': 1, '*E': 1, 'II': 1, 'KK': 1, 'HH': 1, 'HI': 1 };
	const JOSHI_A = 'でなければ|について|かしら|くらい|けれど|なのか|ばかり|ながら|ことよ|こそ|こと|さえ|しか|した|たり|だけ|だに|だの|つつ|ても|てよ|でも|とも|から|など|なり|ので|のに|ほど|まで|もの|やら|より|って|で|と|な|に|ね|の|も|は|ば|へ|や|わ|を|か|が|さ|し|ぞ|て'.split('|');
	const JOSHI_H = {};
	for (let i = 0; i < JOSHI_A.length; i += 1) JOSHI_H[JOSHI_A[i]] = true;

	NS.addInit(1, () => {
		for (let i = 1; i <= 6; i += 1) {
			let ts = document.querySelectorAll(SEL_TARGET + ' h' + i + ':not([class])');
			for (let i = 0; i < ts.length; i += 1) applySeparaterToElement(ts[i]);
		}
		let ts = document.querySelectorAll(SEL_TARGET_SEGMENTER);
		for (let i = 0; i < ts.length; i += 1) applySeparaterToElement(ts[i]);
	});


	// -------------------------------------------------------------------------


	function applySeparaterToElement(elm) {
		const cs = [].slice.call(elm.childNodes, 0);
		const tn = elm.tagName;
		const fs = [];

		for (let i = 0; i < cs.length; i += 1) {
			const c = cs[i];
			if (c.nodeType === 1 /*ELEMENT_NODE*/) {
				applySeparaterToElement(c);
				fs.push(c.outerHTML);
			} else if (c.nodeType === 3 /*TEXT_NODE*/) {
				fs.push(separateTextAndMakeSpans(c.textContent, tn));
			}
		}
		elm.innerHTML = fs.join('');
	}

	function separateTextAndMakeSpans(text, tn) {
		const parts = [];
		let t_prev = '';
		let word = '';
		let isHira = true;

		for (let i = 0, I = text.length; i < I; i += 1) {
			const c = text.substr(i, 1);
			const t = getCtype(c);
			if (PAIRS[t_prev + t] || PAIRS['*' + t] || PAIRS[t_prev + '*']) {
				word += c;
				if (t !== 'I') isHira = false;
			} else if (t === 'O') {
				if (t_prev === 'O') {
					word += c;
					if (t !== 'I') isHira = false;
				} else {
					if (0 < word.length) parts.push([word, true, isHira]);
					word = c;
					isHira = (t === 'I');
				}
			} else {
				if (0 < word.length) parts.push([word, (t_prev !== 'O'), isHira]);
				word = c;
				isHira = (t === 'I');
			}
			t_prev = t;
		}
		if (0 < word.length) parts.push([word, (t_prev !== 'O'), isHira]);

		const newParts = concatenateJoshi(parts);
		if (newParts.length === 1 && tn === 'SPAN') return text;
		return wrapWithSpan(newParts);
	}

	function concatenateJoshi(parts) {
		const newParts = [];
		let prevWs = null;
		for (let i = 0, I = parts.length; i < I; i += 1) {
			const ws = parts[i];
			if (prevWs && prevWs[1] && ws[2] && JOSHI_H[ws[0]]) {
				prevWs[0] += ws[0];
			} else {
				newParts.push(ws);
				prevWs = ws;
			}
		}
		return newParts;
	}

	function wrapWithSpan(parts) {
		let ret = '';
		for (let i = 0, I = parts.length; i < I; i += 1) {
			const ws = parts[i];
			ret += (ws[1]) ? ('<span>' + ws[0] + '</span>') : ws[0];
		}
		return ret;
	}

	function getCtype(c) {
		for (let i = 0; i < CTYPES.length; i += 1) {
			const t = CTYPES[i];
			const p = CPATS[t];
			if (p.test(c)) return t;
		}
		return 'O';
	}


	// -------------------------------------------------------------------------


	NS['segmenter'] = { applySeparaterToElement, separateTextAndMakeSpans };

})(window.ST);
