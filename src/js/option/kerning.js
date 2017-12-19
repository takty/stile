/**
 *
 * Kerning (JS)
 *
 * @author Takuto Yanagida @ Space-Time Inc.
 * @version 2017-10-12
 *
 */


document.addEventListener('DOMContentLoaded', function () {

	var TARGET_SELECTOR = '.stile';
	var TARGET_SELECTOR_KERNING = '.stile-kerning';

	var kerningInfo = {};
	makeKerningParams(kerningInfo,
		['「', '『', '（', '［', '｛', '〈', '《', '【', '〔'],
		['」', '』', '）', '］', '｝', '〉', '》', '】', '〕', '、', '，', '。', '．']
	);
	makeKerningParams(kerningInfo,
		['、', '，', '。', '．'],
		['」', '』', '）', '］', '｝', '〉', '》', '】', '〕']
	);

	var ts = document.querySelectorAll(TARGET_SELECTOR);
	for (var i = 0; i < ts.length; i += 1) applyKerningToElement(ts[i], kerningInfo)
	ts = document.querySelectorAll(TARGET_SELECTOR_KERNING);
	for (var i = 0; i < ts.length; i += 1) applyKerningToElement(ts[i], kerningInfo)


	// -------------------------------------------------------------------------

	function makeKerningParams(ki, start, end) {
		for (var i = 0; i < start.length; i += 1) {
			for (var j = 0; j < end.length; j += 1) {
				ki[end[j] + start[i]] = -0.4;
			}
			ki[start[i]] = -0.4;
		}
	}

	function applyKerningToElement(elm, ki) {
		var cs = Array.prototype.slice.call(elm.childNodes, 0);

		for (var i = 0; i < cs.length; i += 1) {
			var c = cs[i];
			if (c.nodeType === 1 /*ELEMENT_NODE*/) applyKerningToElement(c, ki);
			else if (c.nodeType === 3 /*TEXT_NODE*/) {
				var text = c.textContent;
				if (checkBlock(c.parentNode)) {
					var prev = c.previousSibling;
					var next = c.nextSibling;
					if (!prev || checkBlock(prev)) text = text.replace(/^\s+/g,'');  // trim left
					if (!next || checkBlock(next)) text = text.replace(/\s+$/g,'');  // trim right
				}
				var es = applyKerning(text, ki);
				if (es.length <= 0) continue;
				c.parentNode.replaceChild(es[0], c);
				var ns = es[0].nextSibling;
				if (ns) {
					for (var j = 1; j < es.length; j += 1) {
						ns.parentNode.insertBefore(es[j], ns);
					}
				} else {
					for (var j = 1; j < es.length; j += 1) {
						es[0].parentNode.appendChild(es[j]);
					}
				}
			}
		}
	}

	function checkBlock(elm) {
		if (!(elm instanceof HTMLElement)) return false;
		var d = getComputedStyle(elm).display;
		return (d.indexOf('inline') === -1);
	}

	function applyKerning(text, ki) {
		var res = [];
		var temp = '';

		// White Space Character Class Excluding \u3000
		// [ \f\n\r\t\v​\u00a0\u1680​\u180e\u2000​-\u200a​\u2028\u2029\u202f\u205f​\ufeff]
		text = text.replace(/([^\x01-\x7E\xA1-\xDF]+)([\t\n]+|[ \f\n\r\t\v\u00a0\u1680\u180e\u2000-\u200a\u2028\u2029\u202f\u205f\ufeff]{2})([^\x01-\x7E\xA1-\xDF]+)/g, function (match, g1, d, g2) {return g1 + g2;});

		for (var i = 0, I = text.length; i < I; i += 1) {
			var ch1 = text.substr(i, 1);
			var ch2 = text.substr(i + 1, 1);
			var space = 0;
			var style = '';

			if (ki[ch1 + ch2]) {
				space = ki[ch1 + ch2];
			} else {
				if (ki[ch1 + '*']) space += ki[ch1 + '*'];
				if (ki['*' + ch2]) space += ki['*' + ch2];
			}
			if (space !== 0) {
				style = 'letter-spacing:' + space + 'em;';
			}
			if (i === 0 && ki[ch1]) {
				style += 'margin-left:' + ki[ch1] + 'em;';
			}
			if (style.length > 0) {
				if (temp.length > 0) {
					res.push(document.createTextNode(temp));
					temp = '';
				}
				var span = document.createElement('span');
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

});
