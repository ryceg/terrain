'use strict';
import { downhill } from './downhill';
import * as Geometry from './geometry';
import type { HInterface } from './hinterface';
import { zero } from './zero';

/**
 * getSlope - compute a steepness map
 *
 * @param	height map
 * @return	new map of steepness
 */
export function getSlope(h: HInterface) {
	const dh = downhill(h);
	const slope = zero(h.mesh);
	for (let i = 0; i < h.length; i++) {
		const s = Geometry.trislope(h, i);
		slope[i] = Math.sqrt(s[0] * s[0] + s[1] * s[1]);
		continue;
		// apparently an abandoned older version
		// if (dh[i] < 0) { // local minima have no slope
		//   slope[i] = 0;
		// } else { // slope to downhill neighbor
		//   slope[i] = (h[i] - h[dh[i]]) / distance(h.mesh, i, dh[i]);
		// }
	}
	return slope;
}
