'use strict';
import * as d3 from 'd3';
import * as Geometry from './geometry';
import type { HInterface } from './hinterface';
import { zero } from './zero';
/**
 * relax ... average with neighbors to smoothe terrain
 *
 * @param	height map
 * @return	new height map
 */
export function relax(h: HInterface) {
	const newh = zero(h.mesh);
	for (let i = 0; i < h.length; i++) {
		const nbs = Geometry.neighbors(h.mesh, i);
		// points on border are set to zero
		if (nbs.length < 3) {
			newh[i] = 0;
			continue;
		}
		// new height = average height of neighbors
		newh[i] = d3.mean(
			nbs.map(function (j) {
				return h[j];
			})
		);
	}
	return newh;
}
