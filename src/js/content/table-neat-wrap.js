/**
 *
 * Table Style - Neat Wrap (JS)
 *
 * @author Takuto Yanagida @ Space-Time Inc.
 * @version 2019-06-07
 *
 */


window.ST = window['ST'] || {};


(function (NS) {

	const SEL_TARGET          = '.stile';
	const ST_OPT_NO_NEAT_WRAP = 'no-neat-wrap';

	const CELL_MIN_WIDTH      = 120;
	const CELL_MIN_WIDTH_RATE = 0.15;
	const CELL_MIN_RATIO      = 2 / 3;  // width : height

	const MAX_ROW_COUNT       = 200;
	const IS_COMPAT_MODE      = (NS.BROWSER === 'ie11');


	NS.addInitializer(4, () => {
		const tabs = document.querySelectorAll(SEL_TARGET + ' table:not([class])');
		setTimeout(() => { initialize(tabs); }, 0);
	});


	// -------------------------------------------------------------------------


	function initialize(tabs) {
		const tabsFlt = [];
		for (let i = 0; i < tabs.length; i += 1) {
			if (!NS.containStile(tabs[i], ST_OPT_NO_NEAT_WRAP)) tabsFlt.push(tabs[i]);
		}
		const lt = tabsFlt[tabsFlt.length - 1];
		const d = createDummyCell(lt);
		for (let t of tabsFlt) apply(t, d);
		lt.removeChild(d);
	}

	function createDummyCell(table) {
		const dummy = document.createElement('td');
		dummy.style.display    = 'inline-block';
		dummy.style.position   = 'fixed';
		dummy.style.visibility = 'hidden';
		table.appendChild(dummy);
		return dummy;
	}

	function apply(table, dummyCell) {
		if (table.getAttribute('width') != null) table.setAttribute('width', '');
		table.style.maxWidth = '';

		const tbody = table.tBodies[0];
		if (tbody.clientWidth <= table.clientWidth) return;
		if (MAX_ROW_COUNT < countRows(table)) return;

		const grid = makeCellGrid(table);
		if (grid.length === 0) return;

		const newWs = [];
		for (let x = 0; x < grid[0].length; x += 1) newWs.push(false);

		const data = collectMetrix(table, grid);
		if (IS_COMPAT_MODE) {
			calcNewWidthes_simply(grid, data, newWs);
		} else {
			calcNewWidthes(grid, data, newWs, dummyCell);
		}
		setCellWidth(grid, newWs);
	}

	function countRows(table) {
		const thead = table.tHead;
		const tbody = table.tBodies[0];
		const tfoot = table.tFoot;

		let count = 0;
		if (thead) count += thead.rows.length;
		if (tbody) count += tbody.rows.length;
		if (tfoot) count += tfoot.rows.length;
		return count;
	}

	function collectMetrix(table, grid) {
		const td = table.getElementsByTagName('td')[0];
		const s = getComputedStyle(td);

		const padH = parseFloat(s.paddingLeft) + parseFloat(s.paddingRight);
		const padV = parseFloat(s.paddingTop) + parseFloat(s.paddingBottom);
		const lineHeight = parseFloat(s.lineHeight);
		const origTableWidth = table.clientWidth;

		const cellMinWidth = Math.max(CELL_MIN_WIDTH, origTableWidth * CELL_MIN_WIDTH_RATE);
		const origCellWidths = [];
		for (let x = 0; x < grid[0].length; x += 1) origCellWidths.push(grid[0][x].clientWidth);

		return { padH, padV, lineHeight, origTableWidth, origCellWidths, cellMinWidth };
	}

	function setCellWidth(grid, ws) {
		for (let y = 0; y < grid.length; y += 1) {
			const gridRow = grid[y];
			for (let x = 0; x < gridRow.length; x += 1) {
				const td = gridRow[x], w = ws[x];
				if (td === undefined || td === null || typeof td === 'number' || w === false) continue;
				td.style.whiteSpace = 'normal';
				td.style.minWidth   = w + 'px';
				td.style.width      = '';
			}
		}
	}


	// -------------------------------------------------------------------------


	function makeCellGrid(table) {
		const thead = table.tHead;
		const tbody = table.tBodies[0];
		const tfoot = table.tFoot;

		const cells = [];
		if (thead) addCells(thead.rows, cells);
		if (tbody) addCells(tbody.rows, cells);
		if (tfoot) addCells(tfoot.rows, cells);

		let maxWidth = 0, tab = [];
		for (let i = 0; i < cells.length; i += 1) {
			const w = cells[i].length;
			if (maxWidth < w) maxWidth = w;
		}
		for (let i = 0; i < cells.length; i += 1) {
			const a = [];
			a.length = maxWidth;
			tab.push(a);
		}

		for (let y = 0; y < tab.length; y += 1) {
			const row = tab[y];
			const tds = cells[y];
			let i = 0;

			for (let x = 0; x < maxWidth; x += 1) {
				if (typeof row[x] === 'number' || row[x] === null) continue;

				const td = tds[i]
				const colSpan = td.getAttribute('colSpan') | 1;
				const rowSpan = td.getAttribute('rowSpan');
				row[x] = td;

				if (1 < colSpan) {
					for (let p = 1; p < colSpan; p += 1) row[x + p] = p;
				}
				if (1 < rowSpan) {
					for (let q = 1; q < rowSpan; q += 1) {
						const nr = tab[y + q];
						for (let p = 0; p < colSpan; p += 1) nr[x + p] = null;
					}
				}
				i += 1;
				if (tds.length <= i) break;
			}
		}
		return tab;
	}

	function addCells(trs, cells) {
		for (let i = 0; i < trs.length; i += 1) {
			const tr = trs[i], row = [];
			if (tr.hasChildNodes()) {
				const cns = tr.childNodes;
				for (let j = 0; j < cns.length; j += 1) {
					const cn = cns[j], tn = cn.tagName;
					if (tn === 'TD' || tn === 'TH') row.push(cn);
				}
			}
			cells.push(row);
		}
	}


	// -------------------------------------------------------------------------


	function calcNewWidthes_simply(grid, data, newWs) {
		const origWs = [].concat(newWs);
		for (let y = 0; y < grid.length; y += 1) {
			const gridRow = grid[y];

			for (let x = 0; x < gridRow.length; x += 1) {
				if (newWs[x] !== false) continue;

				const td = gridRow[x];
				if (td === null || typeof td === 'number') continue;
				if (x < gridRow.length - 1 && typeof gridRow[x + 1] === 'number') continue;

				const aw = td.clientWidth - data.padH;
				const l = td.getElementsByTagName('br').length + 1;
				origWs[x] = aw;

				let minW = 0;
				for (let i = 2;; i += 1) {
					const tempW = aw / i + data.padH;
					const tempH = l * (i * data.lineHeight) + data.padV;
					if (tempW < CELL_MIN_WIDTH || tempW / tempH < CELL_MIN_RATIO) break;
					minW = tempW;
				}
				if (minW) newWs[x] = Math.max(newWs[x], minW);
			}
		}
		widenTableWidth_simply(newWs, origWs, data.origTableWidth);
	}

	function widenTableWidth_simply(newWs, origWs, widthOrig) {
		let widthNew = 0;
		for (let i = 0; i < newWs.length; i += 1) {
			if (newWs[i] === false) return;
			widthNew += newWs[i];
		}
		if (widthNew >= widthOrig) return;

		const keepAws = [];
		for (let i = 0; i < newWs.length; i += 1) {
			const rw = newWs[i] / widthNew * widthOrig;
			keepAws.push(origWs[i] < rw);
		}
		for (let i = 0; i < newWs.length; i += 1) {
			if (keepAws[i]) {
				widthNew  -= newWs[i];
				widthOrig -= origWs[i];
				newWs[i] = origWs[i];
			}
		}
		for (let i = 0; i < newWs.length; i += 1) {
			if (!keepAws[i]) newWs[i] = newWs[i] / widthNew * widthOrig;
		}
	}


	// -------------------------------------------------------------------------


	function calcNewWidthes(grid, data, newWs, dummy) {
		const wrapped = [];

		for (let y = 0; y < grid.length; y += 1) {
			const gridRow = grid[y];

			for (let x = 0; x < gridRow.length; x += 1) {
				wrapped[x] = false;
				const td = gridRow[x];
				if (td === undefined || td === null || typeof td === 'number') continue;
				if (x < gridRow.length - 1 && typeof gridRow[x + 1] === 'number') continue;

				td.innerHTML = td.innerHTML.trim();  // trim!!
				dummy.innerHTML = td.innerHTML + 'm';  // for adding error factor
				const aw = dummy.clientWidth - data.padH;
				const l = Math.round((dummy.clientHeight - data.padV) / data.lineHeight);

				let minW = 0;
				for (let i = 1;; i += 1) {
					const tempW = aw / i + data.padH;
					const tempH = l * (i * data.lineHeight) + data.padV;
					if (tempW < data.cellMinWidth || tempW / tempH < CELL_MIN_RATIO) break;
					if (1 < i) wrapped[x] = true;
					minW = tempW;
				}
				if (minW) newWs[x] = Math.max(newWs[x], minW);
			}
		}
		widenTableWidth(newWs, wrapped, data);
	}

	function widenTableWidth(newWs, wrapped, data) {
		let widthNew = 0, widthFix = 0;
		for (let i = 0; i < newWs.length; i += 1) {
			if (newWs[i] === false) return;
			if (wrapped[i]) {
				widthNew += newWs[i];
			} else {
				widthFix += newWs[i];
			}
		}
		if (widthNew + widthFix < data.origTableWidth) {
			let realloc = data.origTableWidth - widthFix;
			for (let i = 0; i < newWs.length; i += 1) {
				if (wrapped[i]) {
					let w = newWs[i] / widthNew * realloc;
					w = Math.min(w, data.origCellWidths[i]);
					realloc  -= (w - newWs[i]);
					widthNew -= (w - newWs[i]);
					newWs[i] = w;
				}
			}
		}
	}

})(window.ST);
