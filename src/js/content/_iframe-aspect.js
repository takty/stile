/**
 *
 * Iframe Aspect
 *
 * @author Takuto Yanagida
 * @version 2021-12-26
 *
 */


function apply(fs) {
	for (const f of fs) {
		if (!f.style.aspectRatio) {
			const [w, h] = extractIframeSize(f);
			if (w && h) {
				f.style.aspectRatio = `${w} / ${h}`;
			}
		}
	}
}

function extractIframeSize(f) {
	let w = parseInt(f.width);
	let h = parseInt(f.height);
	if (w && h) return [w, h];

	const sW = f.style.width;
	const sH = f.style.height;
	if (sW.indexOf('px') !== sW.length - 2) return [0, 0];
	if (sH.indexOf('px') !== sH.length - 2) return [0, 0];
	w = parseInt(sW);
	h = parseInt(sH);
	if (w && h) return [w, h];
	return [0, 0];
}
