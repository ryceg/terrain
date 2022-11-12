'use strict';
import { getFlux } from './getFlux';
import { getSlope } from './getSlope';
import type { HInterface } from './hinterface';
import { zero } from './zero';

/**
 * erosionRate - compute erosion rate in each cell
 *	Vflow is proportional to slope
 *	erosion force is proportional to Vflow**2
 *	erosion is proportional to flow * erosion force
 *
 * @param	height map
 * @return	new map of erosion rate per cell
 */
export function erosionRate(h: HInterface) {
	const flux = getFlux(h); // get water flow per cell
	const slope = getSlope(h); // get slope per cell
	const newh = zero(h.mesh);
	for (let i = 0; i < h.length; i++) {
		const river = Math.sqrt(flux[i]) * slope[i]; // vol * velocity
		const creep = slope[i] * slope[i]; // velocity ** 2
		let total = 1000 * river + creep; // removal rate
		total = total > 200 ? 200 : total; // capped at 200
		newh[i] = total;
	}
	return newh;
}
