/**
 *
 * Segmenter
 *
 * @author Takuto Yanagida
 * @version 2022-01-07
 *
 */


function apply(ts, opts = {}) {
	if (ts.length === 0) return;

	opts = Object.assign({
		styleSegment        : '',
		styleDisabled       : ':ncNoSegmentation',
		doDisableOnSelecting: true,
		properNouns         : [],
	}, opts);
	sortProperNouns(opts);

	for (const t of ts) {
		segmentElement(t, opts);
		if (opts['doDisableOnSelecting']) {
			const f = () => {
				removeSegment(t, opts);
				t.removeEventListener('selectstart', f);
			};
			t.addEventListener('selectstart', f);
		}
	}
}

function removeSegment(elm, opts) {
	const sty = opts.styleSegment;
	for (const s of [...elm.getElementsByTagName('span')]) {
		if ((sty.length === 0 && s.className === '') || hasClass(s, sty)) {
			const df = document.createDocumentFragment();
			for (const c of [...s.childNodes]) {
				df.appendChild(c);
			}
			s.parentNode.replaceChild(df, s);
		}
	}
}

function applyToString(str, opts = {}) {
	opts = Object.assign({
		styleSegment : '',
		styleDisabled: ':ncNoSegmentation',
		properNouns  : [],
	}, opts);
	sortProperNouns(opts);

	const [ts, ws] = getSegment(str, opts.properNouns);
	return createFragment(str, ts, ws, opts);
}

function sortProperNouns(opts) {
	const pns = opts['properNouns'].map(e => [...e]);
	pns.sort((a, b) => {
		return b.length - a.length;
	});
	opts['properNouns'] = pns;
}


// -------------------------------------------------------------------------


function segmentElement(elm, opts) {
	for (const c of [...elm.childNodes]) {
		if (c.nodeType === 1) {  // ELEMENT_NODE
			if (!hasClass(c, opts.styleDisabled)) segmentElement(c, opts);
		} else if (c.nodeType === 3) {  // TEXT_NODE
			segmentTextNode(c, opts);
		}
	}
}

function segmentTextNode(tn, opts) {
	let str = tn.textContent;
	str = removeWhiteSpacesBetweenZenChars(str);

	const [ts, ws] = getSegment(str, opts.properNouns);
	const f = createFragment(str, ts, ws, opts);
	tn.parentNode.replaceChild(f, tn);
}


// -----------------------------------------------------------------------------


const IW = 'そうはいうものの,そればかりでなく,ありとあらゆる,いずれにしても,かけがえのない,そうしてみると,そうすることで,そうでないなら,そうではあるが,それにくわえて,それはさておき,どっちにしても,とはいうものの,なぜかというと,にもかかわらず,いいかえると,いずれにしろ,いずれにせよ,いってみれば,おもいきった,しかしながら,じつのところ,じつはいうと,そうしないと,そうではなく,そのためには,それどころか,それにしても,それによって,そればかりか,それはそうと,どちらにせよ,どっちにせよ,いろいろな,このように,さまざまな,さもないと,したがって,そういえば,そうしたら,そうすると,そうすれば,そうなると,そうなれば,そのかわり,それなのに,それゆえに,たくまざる,だとしたら,だとすると,だとすれば,ではあるが,というのは,というのも,というより,なぜならば,やすやすと,ようするに,ああいう,ああした,あたかも,あらゆる,あるいは,いかなる,いつかは,いっぱい,いろんな,いわゆる,おおきな,おかしな,おそらく,おなじく,おまけに,かえって,かくして,かわりに,くわえて,ぐんぐん,けれども,こういう,こうして,このため,しかるに,しばらく,すなわち,そういう,そうした,そのうえ,そのくせ,そのため,そもそも,それから,それから,それでは,それでも,それとも,それなら,それには,たいした,たいそう,たくさん,だけども,たとえば,たやすく,ちいさな,ちなみに,というか,どういう,とうてい,ときどき,ところが,どころか,ところで,となると,となれば,とにかく,とはいえ,ともあれ,とりわけ,ないしは,なかでも,なぜなら,なぜなら,なだたる,なにしろ,ならびに,はじめに,はずべき,はなはだ,ひいては,ひょんな,ふとした,ほかには,ほかにも,めっきり,もしくは,もっとも,あまり,あらぬ,ありし,あんな,いただ,いつか,いつも,いわば,および,かかる,かなり,きたる,きっと,けれど,ことに,こんな,さらに,しかし,しかも,じつは,じゃあ,すぐに,すぐに,すると,そこで,そして,そっと,それで,それに,そんな,だから,だけど,ただし,だって,たまに,つぎに,つまり,ですが,とある,どうか,ときに,とくに,とても,とんだ,どんな,なにせ,なのに,ならば,ほんの,まさか,または,むこう,むしろ,もっと,もっと,もっと,ものの,やはり,ゆえに,ようは,よって,ああ,あの,ある,かつ,かの,けど,こう,この,さて,さる,そう,その,だが,ただ,では,でも,どう,どの,なお,なぜ,のに,また,もし,よく,わが'.split(',');
const AW = 'けれども,ところで,において,について,かしら,がてら,くらい,ぐらい,けれど,ってば,ながら,などの,なんぞ,ばかり,ものか,ものの,かい,から,かり,きり,こそ,さえ,しか,ずつ,だけ,だの,たり,つつ,では,ても,でも,とも,なぞ,など,なり,にて,には,ので,のに,のみ,ほど,まで,まま,もん,やら,より,か,が,さ,し,ぜ,ぞ,て,で,と,な,に,ね,の,は,ば,へ,も,や,よ,わ,を'.split(',');

const AI1       = 'がおこな,のような,があり,がおき,ができ,がでて'.split(',');
const PRE_KANJI = 'お,ご'.split(',');
const PRE_NUM   = '第,約'.split(',');

function getSegment(str, properNouns) {
	const ts = createCharTypeArray(str);
	const ws = Array(ts.length).fill(0);

	weightByCharTypes(ts, ws);

	const strA = [...str];
	if (properNouns.length) weightByPhrases(strA, ws, properNouns, -1);  // Divide
	weightByPhrases(strA, ws, IW, -1);  // Divide
	weightByPhrases(strA, ws, AW, 1);  // Concat

	weightByPhrases(strA, ws, AI1, -1, 1);  // Divide with offset
	weightByPhraseAndType(strA, ts, ws, PRE_KANJI, CLS_ALL,      'H', -1, 2);
	weightByPhraseAndType(strA, ts, ws, PRE_NUM,   CLS_WO_KANJI, 'N',  0, 2);

	return [ts, ws];
}


// -----------------------------------------------------------------------------


const CLS_WO_KANJI = 'SETIKNVO';
const CLS_ALL      = 'SETIKHNVO';
const CLS_ORIG     = 'NVO';

const CHAR_PATTERNS = [
	['S', /[「『（［｛〈《【〔〖〘〚＜“]/u],
	['E', /[」』）］｝〉》】〕〗〙〛＞”]/u],
	['T', /[、，。．？！を：・]/u],
	['I', /[ぁ-んゝ]/u],
	['K', /[ァ-ヴーｱ-ﾝﾞｰ]/u],
	['H', /[々〆ヵヶ]|[\u4E00-\u9FFF]|[\u{20000}-\u{2A6DF}]/u],  // Special Characters, CJK Unified Ideographs, CJK Unified Ideographs Extension B
	['N', /[0-9０-９]/u],
	['V', /\s/u],
];

function createCharTypeArray(str) {
	const ts = [];
	for (const c of str) {
		ts.push(getCharType(c));
	}
	return ts;
}

function getCharType(c) {
	for (const [t, p] of CHAR_PATTERNS) {
		if (p.test(c)) return t;
	}
	return 'O';
}


// -----------------------------------------------------------------------------


const PAIRS = {
	'*S': -1, 'S*': 2,
	'*E': 2,
	'*T': 99, 'T*': -99,
	'*V': -1, 'V*': -1,
	'II': 1, 'KK': 1, 'HH': 1,  'NN': 1, 'OO': 1, 'TT': 1,
	'HI': 1,
	'NH': 2, 'NK': 1, 'NI': 1,
	'ON': 1, 'NO': 1,
};

function weightByCharTypes(ts, ws) {
	for (let i = 1; i < ts.length; i += 1) {
		const t0 = ts[i - 1];
		const t1 = ts[i];
		ws[i] += (PAIRS[t0 + t1] ?? 0) + (PAIRS['*' + t1] ?? 0) + (PAIRS[t0 + '*'] ?? 0);
	}
}


// -----------------------------------------------------------------------------


function divideByPhrases(strA, ws, phrases) {
	for (const ph of phrases) {
		const phA = [...ph];
		const phL = phA.length;

		for (let bgn = 0;;) {
			const idx0 = indexOfArray(strA, phA, bgn);
			if (idx0 === -1) break;
			const idx1 = idx0 + phL;

			ws[idx0] -= phL;
			for (let i = 1; i < phL; i += 1) ws[idx0 + i] += phL;
			bgn = idx1;
		}
	}
}

function divideByCombinedPhrases(strA, ws, phrases, al) {
	for (const ph of phrases) {
		const phA = [...ph];
		const phL = phA.length;

		for (let bgn = 0;;) {
			const idx0 = indexOfArray(strA, phA, bgn);
			if (idx0 === -1) break;
			const idx1 = idx0 + phL;

			ws[idx0 + al] -= phL - al;
			for (let i = 1; i < phL - al; i += 1) ws[idx0 + al + i] += phL - al;
			bgn = idx1;
		}
	}
}

function concatByPhrases(strA, ws, phrases) {
	for (const ph of phrases) {
		const phA = [...ph];
		const phL = phA.length;

		for (let bgn = 0; ;) {
			const idx0 = indexOfArray(strA, phA, bgn);
			if (idx0 === -1) break;
			const idx1 = idx0 + phL;

			ws[idx0] += phL;
			for (let i = 1; i < phL; i += 1) ws[idx0 + i] += phL;
			bgn = idx1;
		}
	}
}

function weightByPhrases(strA, ws, phrases, factor, offset = 0) {
	for (const ph of phrases) {
		const phA = [...ph];
		const phL = phA.length;

		for (let bgn = 0;;) {
			const idx0 = indexOfArray(strA, phA, bgn);
			if (idx0 === -1) break;
			const idx1 = idx0 + phL;

			ws[idx0 + offset] += (phL - offset) * factor;
			for (let i = 1; i < phL - offset; i += 1) {
				ws[idx0 + offset + i] += (phL - offset);
			}
			bgn = idx1;
		}
	}
}

function weightByPhraseAndType(strA, ts, ws, phrases, prevCts, nextCts, prevW, nextW) {
	const tsL = ts.length;

	for (const ph of phrases) {
		const phA = [...ph];
		const phL = phA.length;

		for (let bgn = 0; ;) {
			const idx0 = indexOfArray(strA, phA, bgn);
			if (idx0 === -1) break;
			const idx1 = idx0 + phL;

			if (
				(idx0 === 0   || (idx0 !== 0 && prevCts.includes(ts[idx0 - 1]))) &&
				(idx1 === tsL || (idx1 < tsL && nextCts.includes(ts[idx1])))
			) {
				ws[idx0] += prevW;
				if (idx1 < ws.length) ws[idx1] += nextW;
				for (let i = 1; i < phL; i += 1) ws[idx0 + i] += phL;
			}
			bgn = idx1;
		}
	}
}

function indexOfArray(array, searchElement, fromIndex = 0) {
	if (array === null || array === undefined) {
		return -1;
	}
	if (array.length === 0) {
		return 0;
	}
	for (let i = fromIndex; i < array.length - searchElement.length + 1; i += 1) {
		let match = true;

		for (let j = 0; j < searchElement.length; j += 1) {
			if (array[i + j] !== searchElement[j]) {
				match = false;
				break;
			}
		}
		if (match) {
			return i;
		}
	}
	return -1;
}


// -----------------------------------------------------------------------------


function createFragment(str, ts, ws, opts) {
	const df = document.createDocumentFragment();
	let temp = '';
	let bgn  = 0;

	let idx = 0;
	for (const c of str) {
		if (ws[idx] <= 0) {
			const isOrig = isOriginalCharPhrase(ts, bgn, idx);
			appendPhrase(df, temp, isOrig, opts.styleSegment);
			temp = '';
			bgn  = idx;
		}
		temp += c;
		idx  += 1;
	}
	if (temp.length) {
		const isOrig = isOriginalCharPhrase(ts, bgn, ts.length);
		appendPhrase(df, temp, isOrig, opts.styleSegment);
	}
	return df;
}

function appendPhrase(df, str, isOrig, style) {
	if (isOrig) {
		df.appendChild(document.createTextNode(str));
	} else {
		const e = document.createElement('span');
		e.appendChild(document.createTextNode(str));
		if (style.length) setClass(e, style);
		df.appendChild(e);
	}
}

function isOriginalCharPhrase(ts, bgn, end) {
	for (let i = bgn; i < end; i += 1) {
		const t = ts[i];
		if (!CLS_ORIG.includes(t)) {
			return false;
		}
	}
	return true;
}
