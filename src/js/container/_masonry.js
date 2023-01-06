/**
 * Masonry
 *
 * @author Takuto Yanagida
 * @version 2023-01-05
 */

function apply(ts) {
	for (const t of ts) new Masonry(t);
}


// -------------------------------------------------------------------------


class Masonry {
	#cont;
	#its;

	static NS = '--nc-container-masonry-';

	constructor(cont) {
		this.#cont = cont instanceof Node ? cont : document.querySelector(cont);
		this.#its  = this.#cont.querySelectorAll(':scope > *');

		function throttle(fn) {
			let isRunning;
			return (...args) => {
				if (isRunning) return;
				isRunning = true;
				requestAnimationFrame(() => {
					isRunning = false;
					fn(...args);
				});
			};
		}

		if (this.#cont && this.#its.length) {
			const ro = new ResizeObserver(throttle(() => this.#layOut()));
			ro.observe(this.#cont);
			for (const it of this.#its) {
				ro.observe(it);
			}
			const mo = new MutationObserver(throttle(() => {
				this.#its = this.#cont.querySelectorAll(':scope > *');
				this.#layOut();
			}));
			mo.observe(this.#cont, { childList: true });
		}
	}

	#layOut() {
		this.#cont.style.removeProperty(Masonry.NS + 'position');
		this.#cont.style.removeProperty(Masonry.NS + 'width');

		for (const it of this.#its) {
			it.style.translate = '';
		}
		const { gx, gy, cw } = this.#getBaseSize();
		const cols = this.#getColumCount();

		this.#cont.style.setProperty(Masonry.NS + 'position', 'absolute');
		this.#cont.style.setProperty(Masonry.NS + 'width', `${cw}px`);

		const xs = [];
		const ys = [];

		for (let i = 0; i < cols; ++i) {
			xs.push(i * (cw + gx));
			ys.push(0);
		}
		for (const it of this.#its) {
			const r = it.getBoundingClientRect();
			if (!r.width && !r.height) continue;

			const i = ys.indexOf(Math.min(...ys));
			it.style.translate = `${xs[i]}px ${0 | ys[i]}px`;
			ys[i] += r.height + gy;
		}
		this.#cont.style.height = `${Math.max(0, Math.ceil(Math.max(...ys) - gy))}px`;
	}

	#getBaseSize() {
		const s  = window.getComputedStyle(this.#cont);
		const gx = s.columnGap ? parseInt(s.columnGap) : 0;
		const gy = s.rowGap    ? parseInt(s.rowGap)    : 0;

		let cw = 0;
		for (const it of this.#its) {
			const r = it.getBoundingClientRect();
			if (!r.width && !r.height) continue;

			cw = Math.floor(r.width);
			break;
		}
		return { gx, gy, cw };
	}

	#getColumCount() {
		let y = null;
		let c = 0;

		for (const it of this.#its) {
			const r = it.getBoundingClientRect();
			if (!r.width && !r.height) continue;

			if (null === y) y = r.y;
			if (y !== r.y) return c;
			c += 1;
		}
		return c;
	}
}
