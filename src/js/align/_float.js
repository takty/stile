/**
 *
 * Float
 *
 * @author Takuto Yanagida
 * @version 2021-12-26
 *
 */


function apply(tars = {}, opts = {}) {
	tars = Object.assign({ left: [], right: [] }, tars);
	if (tars['left'].length + tars['right'].length === 0 ) return;

	opts = Object.assign({
		styleAlign : ':ncAlign',
		classLeft  : 'alignleft',
		classRight : 'alignright',
		classCenter: 'aligncenter',
		minWidth   : 240,  // px
	}, opts);

	setTimeout(() => {
		assignEventListener(tars['left'], opts['classLeft'], opts);
		assignEventListener(tars['right'], opts['classRight'], opts);
	}, 0);  // Delay
}

function assignEventListener(as, cls, opts) {
	const aws = as.map(e => [e, 0]);
	onScroll(() => storeWidth(aws, cls, opts), true);  // For lazy loading
	onResize(() => update(aws, cls, opts), true);
}


// -------------------------------------------------------------------------


function storeWidth(aws, style, opts) {
	for (const aw of aws) {
		const [a, w] = aw;
		if (10 < w) continue;
		switchFloatOne(a, false, style, opts);
		aw[1] = a.getBoundingClientRect().width;
		switchFloatOne(a, true, style, opts);
	}
}

function update(aws, cls, opts) {
	for (const aw of aws) {
		const [a, w] = aw;
		const cw = contentWidth(a.parentElement);
		const wn = a.getBoundingClientRect().width;
		if (wn < cw * 0.9 && w < wn) {
			aw[1] = wn;
		}
	}
	for (const [a, w] of aws) {
		const cw = contentWidth(a.parentElement, true);
		switchFloatOne(a, cw - w < opts.minWidth, cls, opts);
	}
}

function switchFloatOne(a, enabled, origCls, opts) {
	if (enabled && !hasClass(a, opts.styleAlign)) {
		setClass(a, opts.styleAlign, true, origCls);
		a.classList.remove(origCls);
		a.classList.add(opts.classCenter);
	}
	if (!enabled && hasClass(a, opts.styleAlign)) {
		a.classList.remove(opts.classCenter);
		a.classList.add(origCls);
		setClass(a, opts.styleAlign, false);
	}
}

function contentWidth(e, checkDisplay = false) {
	if (e === null) {
		return window.innerWidth;
	}
	const s = getComputedStyle(e);
	if (checkDisplay && s.display === 'inline') {
		return contentWidth(e.parentElement);
	}
	const ph = parseFloat(s.paddingLeft) + parseFloat(s.paddingRight);
	return e.clientWidth - ph;
}
