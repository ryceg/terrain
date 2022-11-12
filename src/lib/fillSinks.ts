'use strict';
import * as Geometry from './geometry';
import type { HInterface } from './hinterface';
import { zero } from './zero';

/**
 *
 *	find nodes that are lower than ALL of their neighbors
 *	and raise them to the level of their lowest neighbor.
 *
 * @param	height map
 * @param	deminimus altitude difference
 * @return	updated height map
 */
export function fillSinks(h: HInterface, epsilon = 1e-5) {
	// start by setting all non-edge points to infinity
	const infinity = 999999;
	const newh = zero(h.mesh);
	for (let i = 0; i < h.length; i++) {
		if (Geometry.isNearEdge(h.mesh, i)) {
			newh[i] = h[i];
		} else {
			newh[i] = infinity;
		}
	}
	// interate until we stop making changes
	while (true) {
		let changed = false;
		// for each cell in height map
		for (let i = 0; i < h.length; i++) {
			// that has not yet returned to its original height
			if (newh[i] === h[i]) continue;
			// consider all of its neighbors
			const nbs = Geometry.neighbors(h.mesh, i);
			for (let j = 0; j < nbs.length; j++) {
				// if I am higher than any neighbor, return to my original height
				if (h[i] >= newh[nbs[j]] + epsilon) {
					newh[i] = h[i];
					changed = true;
					break;
				}
				// If I still have an exaggerated height, and this neighbor is
				// taller than me, reduce my claimed height to his claimed height.
				// This will end when I claim to be no taller than the shortest
				// neighbor who is taller than I am.
				const oh = newh[nbs[j]] + epsilon;
				if (newh[i] > oh && oh > h[i]) {
					newh[i] = oh;
					changed = true;
				}
			}
		}
		if (!changed) return newh;
	}
}
