/**
 *
 * Kerning
 *
 * @author Takuto Yanagida
 * @version 2022-01-07
 *
 */


function apply(ts, opts = {}) {
	if (ts.length === 0) return;

	opts = Object.assign({
		styleKerning        : ':ncKern',
		styleDisabled       : ':ncNoKerning',
		doAssignAttribute   : true,
		doDisableOnSelecting: true,
	}, opts);

	for (const t of ts) {
		kernElement(t, dict, opts);
		if (opts['doAssignAttribute'] && opts['doDisableOnSelecting']) {
			const f = () => {
				removeKerning(t, opts);
				t.removeEventListener('selectstart', f);
			};
			t.addEventListener('selectstart', f);
		}
	}
}

function removeKerning(elm, opts) {
	for (const s of [...elm.getElementsByTagName('span')]) {
		if (hasClass(s, opts.styleKerning)) {
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
		styleKerning     : ':ncKern',
		styleDisabled    : ':ncNoKerning',
		doAssignAttribute: true,
	}, opts);

	const ks = getKerning(str, dict, false, opts.doAssignAttribute);
	if (ks.length) {
		return createFragment(str, ks, opts);
	}
	return null;
}


// -----------------------------------------------------------------------------


function kernElement(elm, dict, opts) {
	for (const c of [...elm.childNodes]) {
		if (c.nodeType === 1) {  // ELEMENT_NODE
			if (!hasClass(c, opts.styleDisabled)) kernElement(c, dict, opts);
		} else if (c.nodeType === 3) {  // TEXT_NODE
			kernTextNode(c, dict, opts);
		}
	}
}

function kernTextNode(tn, dict, opts) {
	const [isHead, isTail] = isEnd(tn);

	let str = tn.textContent;
	if (isHead) str = removeHeadWhiteSpaces(str);
	if (isTail) str = removeTailWhiteSpaces(str);
	str = removeWhiteSpacesBetweenZenChars(str);

	let nt = '';
	if (tn.nextSibling && tn.nextSibling.nodeType === 1 && getComputedStyle(tn.nextSibling).display === 'inline') {
		nt = tn.nextSibling.innerText;
	}
	if (!tn.nextSibling && tn.parentNode.nextSibling) {
		const parentNext = tn.parentNode.nextSibling;
		if (parentNext.nodeType === 1) {  // ELEMENT_NODE
			const pnd = getComputedStyle(parentNext).display;
			if (pnd.includes('inline')) {
				nt = parentNext.innerText;
			}
		}
		if (parentNext.nodeType === 3) {  // TEXT_NODE
			nt = parentNext.textContent;
		}
	}

	const ks = getKerning(str, dict, isHead, nt, opts.doAssignAttribute);
	if (ks.length) {
		const f = createFragment(str, ks, opts);
		tn.parentNode.replaceChild(f, tn);
	}
}

function isEnd(tn) {
	const p = tn.parentNode;
	if (!(p instanceof HTMLElement)) return [false, false];
	const pd = getComputedStyle(p).display;
	if (!pd.includes('inline')) {  // Block
		return isSiblingBlock(tn);
	}
	if (pd === 'inline-block') {  // Inline block
		if (p.childNodes.length !== 1) {  // The parent has multiple nodes.
			return isSiblingBlock(tn);
		}
		const pp = p.parentNode;
		if (pp) {
			const ppd = getComputedStyle(pp).display;
			if (!ppd.includes('inline')) {
				return isSiblingBlock(p, true);
			}
		}
	}
	return [false, false];  // Not inline block
}

function isSiblingBlock(n, greedy = false) {
	return [greedy ? isPreviousBlockGreedy(n.previousSibling) : isBlock(n.previousSibling), isBlock(n.nextSibling)];
}

function isBlock(n) {
	if (n === null) return true;
	if (!(n instanceof HTMLElement)) return false;
	if (n.tagName === 'BR') return true;
	return !getComputedStyle(n).display.includes('inline');
}

function isPreviousBlockGreedy(n) {
	while (true) {
		if (n === null) return true;
		if (n.nodeType === 1) {
			if (n.tagName === 'BR') return true;
			return !getComputedStyle(n).display.includes('inline');
		}
		if (n.nodeType === 3) {
			if (!n.textContent.trim()) return true;
		}
		n = n.previousSibling;
	}
}


// -----------------------------------------------------------------------------


function getKerning(str, dict, isHead, nextNodeText, assignAttr) {
	let strArray = [...str];
	const ret = [];

	if (nextNodeText.length) {
		strArray = strArray.concat([...nextNodeText]);
	}
	let l = 0;

	for (let i = 0; i < strArray.length; i += 1) {
		const c0 = strArray[i];
		const c1 = strArray[i + 1];

		let a = '';
		if (c0 !== '' && c1 !== '' && dict.has(c0 + c1)) {
			a = assignAttr ? 's' : 'letter-spacing:-0.4em;';
		}
		if (i === 0 && isHead && c0 !== '' && dict.has(c0)) {
			a += assignAttr ? 'h' : 'margin-left:-0.4em';
		}
		if (a.length) {
			if (l) {
				ret.push(l);
				l = 0;
			}
			ret.push(a);
		} else {
			l += 1;
		}
	}
	if (ret.length && l) ret.push(l);
	return ret;
}

function createFragment(str, ks, opts) {
	const strArray = [...str];
	const f = document.createDocumentFragment();
	let i = 0;
	for (const k of ks) {
		if (Number.isInteger(k)) {
			const n = document.createTextNode(strArray.slice(i, i + k).join(''));
			f.appendChild(n);
			i += k;
		} else {
			const n = document.createElement('span');
			n.appendChild(document.createTextNode(strArray.slice(i, i + 1).join('')));
			if (k.length <= 2) {
				setClass(n, opts.styleKerning, true, k);
			} else {
				n.style = k;
			}
			f.appendChild(n);
			i += 1;
		}
	}
	return f;
}


// -----------------------------------------------------------------------------


const dict = new Set();
{
	addPairs(dict, '、，。．・｜：　', '「『（［｛〈《【〔');
	addPairs(dict, '」』）］｝〉》】〕', '、，。．・｜：,.');
	addPairs(dict, '」』）］｝〉》】〕', '「『（［｛〈《【〔');
	addPairs(dict, '「『（［｛〈《【〔', '「『（［｛〈《【〔');
	addPairs(dict, '」』）］｝〉》】〕', '」』）］｝〉》】〕');
	addSolos(dict, '「『（［｛〈《【〔');

	function addPairs(dict, cs0, cs1) {
		for (const c0 of cs0) {
			for (const c1 of cs1) {
				dict.add(c0 + c1);
			}
		}
	}

	function addSolos(dict, head) {
		for (const h of head) {
			dict.add(h);
		}
	}
}
