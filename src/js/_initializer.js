/**
 * Script
 *
 * @author Takuto Yanagida
 * @version 2023-02-01
 */

function initialize(ns, target) {
	// Delay

	const is  = [...target.getElementsByTagName('img')];
	const tis = [...target.querySelectorAll('table img')];
	const ifs = [...target.getElementsByTagName('iframe')];

	ns.delay.applyImage(is.filter(e => !tis.includes(e)));
	ns.delay.applyIframe(ifs);

	// Container

	const ms = target.querySelectorAll('*[class^="masonry-"]');
	ns.container.applyMasonry(ms);

	// Content

	const figs = target.getElementsByTagName('figure');
	const ss   = target.getElementsByTagName('span');

	ns.content.applyImageAlt(is);
	ns.content.applyFigureCaption(figs);
	ns.content.applyIframeAspect(ifs);
	ns.content.applyUnderline(ss);

	// Link

	const as = target.querySelectorAll('a');
	ns.link.applyType(as, { observedSelector: 'main' });
	if (!CSS.supports('scroll-behavior', 'smooth')) {
		ns.link.applySmooth(as, { observedSelector: 'main' });
	}

	// Japanese Text

	const sgs = [...target.getElementsByClassName('segmenter')];
	for (const h of [1, 2, 3, 4, 5, 6]) {
		const ts = target.querySelectorAll(`h${h}:not([class])`);
		for (const t of ts) sgs.push(t);
	}

	ns.ja.applySegmenter(sgs, { properNouns: [] });
	ns.ja.applyKerning([target], { doAssignAttribute: false, doDisableOnSelecting: false });

	// Align

	const left  = [...target.getElementsByClassName('alignleft')];
	const right = [...target.getElementsByClassName('alignright')];
	ns.align.applyFloat({ left, right }, {});

	// List

	const uls = target.getElementsByTagName('ul');
	ns.list.applyCustom(uls);

	// Tab

	const tsc = target.querySelectorAll('.tab-scroll, .pseudo-tab-page');
	const tst = target.querySelectorAll('.tab-stack, .tab-page');
	ns.tab.applyScroll(tsc);
	ns.tab.applyStack(tst);

	// Table

	const tables = target.getElementsByTagName('table');

	ns.table.applyNeatWidth(tables);
	ns.table.applyUsableView(tables);

	// Viewer

	const if_os  = [...target.getElementsByClassName('iframe-opener')];
	const os_ifs = [...target.querySelectorAll('.iframe-opener + iframe')];
	const a_img  = [...target.querySelectorAll('a[data-nc-link-image][data-nc-link-to-image]')];

	ns.viewer.applyIframe(if_os, os_ifs);
	ns.viewer.applyImage(a_img);

	// Utility

	ns.utility.applyBlank();
	ns.utility.applyDimension();

	// Scroll Effect

	const ts = target.querySelectorAll('[data-nc-scroll-effect]');
	ns.scroll.apply(ts);
}
