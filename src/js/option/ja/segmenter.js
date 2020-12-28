/**
 *
 * Japanese Text Segmenter
 *
 * @author Takuto Yanagida @ Space-Time Inc.
 * @version 2020-12-28
 *
 */


window.ST = window['ST'] || {};


(function (NS) {

	const SEL_TARGET = '.stile';
	const SEL_TARGET_SEGMENTER = '.stile-segmenter';

	const CTYPES = ['S', 'E', 'I', 'K', 'H', 'N'];
	const CPATS = {
		S: /[「『（［｛〈《【〔〖〘〚＜“]/u,
		E: /[」』）］｝〉》】〕〗〙〛＞”、，。．？！を：・]/u,
		I: /[ぁ-んゝ]/u,
		K: /[ァ-ヴーｱ-ﾝﾞｰ]/u,
		H: /[一-龠々〆ヵヶ]/u,
		N: /[0-9０-９]/u
	};
	const PAIRS = { 'S*': 1, 'II': 1, 'KK': 1, 'HH': 1, 'HI': 1, 'NN': 1, 'OO': 1, 'ON': 1, 'NO': 1 };
	const JOSHI_A = 'でなければ|について|により|かしら|くらい|けれど|なのか|ばかり|ながら|ことよ|こそ|こと|さえ|しか|した|たり|だけ|だに|だの|つつ|ても|てよ|でも|とも|から|など|なり|ので|のに|ほど|まで|もの|やら|より|って|で|と|な|に|ね|の|も|は|ば|へ|や|わ|を|か|が|さ|し|ぞ|て'.split('|');
	const JOSHI_H = {};
	for (let i = 0; i < JOSHI_A.length; i += 1) JOSHI_H[JOSHI_A[i]] = true;
	const PREKANJI = 'お|ご'.split('|');
	const RENTAI = 'ありとあらゆる|おもいきった|たくまざる|ああいう|ああした|あらゆる|いかなる|いかれる|いわゆる|おおきな|おかしな|そういう|ちいさな|なだたる|はずべき|ひょんな|ふとした|あんな|かかる|きたる|こんな|そんな|とんだ|どんな|むこう|あの|ある|かの|この|さる|その|どの|わが'.split('|');

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
		let parts = [];
		let tP = '';
		let word = '';
		let tWordHead = '';

		for (let i = 0, I = text.length; i < I; i += 1) {
			const c = text.substr(i, 1);
			const t = getCtype(c);
			if (PAIRS[tP + t] || PAIRS['*' + t] || PAIRS[tP + '*']) {
				word += c;
				if (word === c) tWordHead = t;
			} else {
				if (0 < word.length) parts.push([word, tWordHead, tP]);
				word = c;
				tWordHead = t;
			}
			tP = t;
		}
		if (0 < word.length) parts.push([word, tWordHead, tP]);

		parts = concatJoshi(parts);
		parts = concatStopChar(parts);
		parts = concatMeasureWord(parts);
		parts = splitKanjiPrefix(parts, PREKANJI);
		parts = splitTailRentai(parts, RENTAI);
		if (parts.length === 1 && (!tn || tn === 'SPAN')) return text;
		return wrapWithSpan(parts);
	}

	function concatJoshi(ws) {
		const newWs = [];
		let wP = null;
		for (let i = 0, I = ws.length; i < I; i += 1) {
			const w = ws[i];
			if (wP && JOSHI_H[w[0]]) {
				wP[0] += w[0];
				wP[2] = w[2];
			} else {
				newWs.push(w);
				wP = w;
			}
		}
		return newWs;
	}

	function concatStopChar(ws) {
		const newWs = [];
		let wP = null;
		for (let i = 0, I = ws.length; i < I; i += 1) {
			const w = ws[i];
			if (wP && w[1] === 'E') {
				wP[0] += w[0];
				wP[2] = w[2];
			} else {
				newWs.push(w);
				wP = w;
			}
		}
		return newWs;
	}

	function concatMeasureWord(ws) {
		const newWs = [];
		let wP = null;
		for (let i = 0, I = ws.length; i < I; i += 1) {
			const w = ws[i];
			if (wP && wP[2] === 'N') {
				wP[0] += w[0];
				wP[2] = w[2];
			} else {
				newWs.push(w);
				wP = w;
			}
		}
		return newWs;
	}

	function splitKanjiPrefix(ws, pres) {
		if (ws.length <= 1) return ws;
		for (let i = 1, I = ws.length; i < I; i += 1) {
			const w = ws[i], wP = ws[i - 1], swP = wP[0];
			if (w[1] !== 'H') continue;
			for (let j = 0; j < pres.length; j += 1) {
				const pre = pres[j];
				const len = pre.length;
				if (endsWith(swP, pre)) {
					wP[0] = swP.substr(0, swP.length - len);
					wP[2] = getCtype(wP[0][wP[0].length - 1]);
					w[0] = pre + w[0];
					w[1] = 'I';
				}
			}
		}
		return ws;
	}

	function splitTailRentai(ws, pns) {
		const newWs = [];
		for (let i = 0, I = ws.length; i < I; i += 1) {
			const w = ws[i];
			let split = false;
			for (let j = 0; j < pns.length; j += 1) {
				const pn = pns[j];
				if (endsWith(w[0], pn)) {
					w[0] = w[0].substr(0, w[0].length - pn.length);
					newWs.push(w);
					newWs.push([pn, 'I', 'I']);
					split = true;
					break;
				}
			}
			if (split) continue;
			newWs.push(w);
		}
		return newWs;
	}

	function wrapWithSpan(ws) {
		let ret = '';
		for (let i = 0, I = ws.length; i < I; i += 1) {
			const w = ws[i];
			ret += (w[1] !== 'O' || w[2] !== 'O') ? ('<span>' + w[0] + '</span>') : w[0];
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

	function endsWith(self, search) {
		if (String.prototype.endsWith) return self.endsWith(search);
		const len = self.length;
		return self.substring(len - search.length, len) === search;
	}


	// -------------------------------------------------------------------------


	NS['segmenter'] = { applySeparaterToElement, separateTextAndMakeSpans };

})(window.ST);
