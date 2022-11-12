'use strict';
import * as d3 from 'd3';
import { erosionRate } from './erosionRate';
import type { HInterface } from './hinterface';
import { zero } from './zero';

/**
 * erode - reduce per cell height by erosion
 *	scale per-cell erosion rates to amount
 *	and then subtract each cell's erosion from height
 *
 * @param	height map
 * @param	max per-cell erosion
 * @return	updated height map
 */
export function erode(h: HInterface, amount: number) {
	const er = erosionRate(h);
	const newh = zero(h.mesh);
	const maxr = d3.max(er);
	for (let i = 0; i < h.length; i++) {
		newh[i] = h[i] - amount * (er[i] / maxr);
	}
	return newh;
}
