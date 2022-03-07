/**
 *
 * Image Alt
 *
 * @author Takuto Yanagida
 * @version 2021-12-26
 *
 */


function apply(ts) {
	for (const t of ts) {
		if (!t.alt && t.src) {
			let src = t.src.trim();
			if (src.endsWith('/')) src = src.substring(0, src.length - 1);
			const idx = src.lastIndexOf('/');
			if (idx === -1) continue;
			t.alt = src.substring(idx + 1);
		}
	}
}
