/* eslint-disable complexity */
/* eslint-disable no-irregular-whitespace */
/**
 *
 * Kerning
 *
 * @author Takuto Yanagida @ Space-Time Inc.
 * @version 2020-05-08
 *
 */


window.ST = window['ST'] || {};


(function (NS) {

	const SEL_TARGET = '.stile';
	const SEL_TARGET_KERNING = '.stile-kerning';
	const ST_NO_KERNING = 'no-kerning';

	const OFFSET_KERNING_PAIR = -0.4;
	const OFFSET_KERNING_SOLO = -0.5;

	const kerningInfo = {};
	makeKerningPairs(kerningInfo,
		['、', '，', '。', '．', '・', '｜', '：', '　'],
		['「', '『', '（', '［', '｛', '〈', '《', '【', '〔']
	);
	makeKerningPairs(kerningInfo,
		['」', '』', '）', '］', '｝', '〉', '》', '】', '〕'],
		['、', '，', '。', '．', '・', '｜', '：', ',', '.']
	);
	makeKerningPairs(kerningInfo,
		['」', '』', '）', '］', '｝', '〉', '》', '】', '〕'],
		['「', '『', '（', '［', '｛', '〈', '《', '【', '〔']
	);
	makeKerningPairs(kerningInfo,
		['「', '『', '（', '［', '｛', '〈', '《', '【', '〔'],
		['「', '『', '（', '［', '｛', '〈', '《', '【', '〔']
	);
	makeKerningPairs(kerningInfo,
		['」', '』', '）', '］', '｝', '〉', '》', '】', '〕'],
		['」', '』', '）', '］', '｝', '〉', '》', '】', '〕']
	);
	makeKerningSolos(kerningInfo,
		['「', '『', '（', '［', '｛', '〈', '《', '【', '〔']
	);

	NS.addInit(2, function () {
		let ts = document.querySelectorAll(SEL_TARGET);
		for (let i = 0; i < ts.length; i += 1) applyKerningToElement(ts[i], kerningInfo);
		ts = document.querySelectorAll(SEL_TARGET_KERNING);
		for (let i = 0; i < ts.length; i += 1) applyKerningToElement(ts[i], kerningInfo);
	});


	// -------------------------------------------------------------------------

	function makeKerningPairs(ki, tail, head) {
		for (let i = 0; i < head.length; i += 1) {
			for (let j = 0; j < tail.length; j += 1) {
				ki[tail[j] + head[i]] = OFFSET_KERNING_PAIR;
			}
		}
	}

	function makeKerningSolos(ki, head) {
		for (let i = 0; i < head.length; i += 1) {
			ki[head[i]] = OFFSET_KERNING_SOLO;
		}
	}

	function applyKerningToElement(elm, ki) {
		const cs = [].slice.call(elm.childNodes, 0);

		for (let i = 0; i < cs.length; i += 1) {
			const c = cs[i];
			if (c.nodeType === 1 /*ELEMENT_NODE*/) {
				if (!NS.containStile(c, ST_NO_KERNING)) applyKerningToElement(c, ki);
			} else if (c.nodeType === 3 /*TEXT_NODE*/) {
				let text = c.textContent;
				let prev = c.previousSibling;
				const isParentBlock = isBlockParent(c.parentNode);
				if (isParentBlock) {
					const next = c.nextSibling;
					if (!prev || isBlockSibling(prev)) {
						const mzs = text.match(/^[\n\r\t ]*(\u3000*)/);
						const zs = (mzs && 1 < mzs.length) ? mzs[1] : '';
						text = zs + text.replace(/^\s+/g, '');  // trim left
					}
					if (!next || isBlockSibling(next)) text = text.replace(/\s+$/g,'');  // trim right
				}
				const es = applyKerning(text, ki, isParentBlock && (prev === null || isBlockSibling(prev)));
				if (es.length <= 0) continue;
				c.parentNode.replaceChild(es[0], c);
				const ns = es[0].nextSibling;
				if (ns) {
					for (let j = 1; j < es.length; j += 1) {
						ns.parentNode.insertBefore(es[j], ns);
					}
				} else {
					for (let j = 1; j < es.length; j += 1) {
						es[0].parentNode.appendChild(es[j]);
					}
				}
			}
		}
	}

	function isBlockParent(elm) {
		if (!(elm instanceof HTMLElement)) return false;
		const d = getComputedStyle(elm).display;
		if (d.indexOf('inline') === -1) return true;
		if (d.indexOf('inline-block') !== -1) {  // is inline block
			const cs = elm.childNodes;
			if (cs.length === 1 && cs[0].nodeType === 3 /*TEXT_NODE*/) {
				if (elm.parentNode) {
					const pd = getComputedStyle(elm.parentNode).display;
					if (pd.indexOf('inline') === -1 && elm.parentNode.firstChild === elm) return true;
				}
				return false;  // When it has only one text child
			}
			return true;
		}
		return false;
	}

	function isBlockSibling(elm) {
		if (!(elm instanceof HTMLElement)) return false;
		const d = getComputedStyle(elm).display;
		return d.indexOf('inline') === -1 || elm.tagName === 'BR';
	}

	function applyKerning(text, ki, isHead) {
		const res = [];
		let temp = '';

		// White Space Character Class Excluding \u3000
		// [ \f\n\r\t\v​\u00a0​\u180e\u2000​-\u200a​\u2028\u2029\u202f\u205f​\ufeff]
		// eslint-disable-next-line no-control-regex
		text = text.replace(/([^\x01-\x7E\xA1-\xDF]+)([\t\n]+|[ \f\n\r\t\v\u00a0\u180e\u2000-\u200a\u2028\u2029\u202f\u205f\ufeff]{2})([^\x01-\x7E\xA1-\xDF]+)/g, function (match, g1, d, g2) {return g1 + g2;});

		for (let i = 0, I = text.length; i < I; i += 1) {
			const ch1 = text.substr(i, 1);
			const ch2 = text.substr(i + 1, 1);
			let space = 0;
			let style = '';
			if (ch1 !== '' && ch2 !== '' && ki[ch1 + ch2]) {
				space = ki[ch1 + ch2];
				style = 'letter-spacing:' + space + 'em;';
			}
			if (i === 0 && ch1 !== '' && ki[ch1] && isHead) {
				style += 'margin-left:' + ki[ch1] + 'em;';
			}
			if (style.length > 0) {
				if (temp.length > 0) {
					res.push(document.createTextNode(temp));
					temp = '';
				}
				const span = document.createElement('span');
				span.innerText = ch1;
				span.setAttribute('style', style);
				res.push(span);
			} else {
				temp += ch1;
			}
		}
		if (temp.length > 0) res.push(document.createTextNode(temp));
		return res;
	}

})(window.ST);
