'use strict';
import { downhill } from './downhill';
import type { HInterface } from './hinterface';
import { zero } from './zero';

/**
 * getFlux - compute water entering each cell
 *
 * @param	height map
 * @return	water influx map
 */
export function getFlux(h: HInterface) {
	const dh = downhill(h);
	// all cells start out getting equal water
	const idxs = [];
	const flux = zero(h.mesh);
	for (let i = 0; i < h.length; i++) {
		idxs[i] = i;
		flux[i] = 1 / h.length;
	}

	// sort mesh points by height
	idxs.sort(function (a, b) {
		return h[b] - h[a];
	});

	// compute transitive closure of down-hill flow
	for (let i = 0; i < h.length; i++) {
		const j = idxs[i];
		if (dh[j] >= 0) {
			flux[dh[j]] += flux[j];
		}
	}
	return flux;
}
