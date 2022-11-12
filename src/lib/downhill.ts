'use strict';
import * as Geometry from './geometry';
import type { HInterface } from './hinterface';

/**
 * downhill - construct/return a
 *
 * @param	height map
 * @return	list <x,y> of most down-hill neigtbor of every point
 *
 * We remember this, so we don't have to recompute it
 */
export function downhill(h: HInterface) {
	if (h.downhill) return h.downhill;

	/**
	 * downfrom - return index of down-hill neighbor
	 *	-1 if this is a local minimum
	 *	-2 if this is at edge of map
	 */
	function downfrom(i: number): number | number[] {
		if (Geometry.isEdge(h.mesh, i)) return -2; // this is clearly meant to be an error code
		let best = -1; // this is another error code
		let besth = h[i];
		const nbs = Geometry.neighbors(h.mesh, i);
		for (let j = 0; j < nbs.length; j++) {
			if (h[nbs[j]] < besth) {
				besth = h[nbs[j]];
				best = nbs[j];
			}
		}
		return best; // this is either a point or a -1
	}

	// find down-hill from every point in mesh
	const downs = [];
	for (let i = 0; i < h.length; i++) {
		downs[i] = downfrom(i);
	}
	h.downhill = downs;

	return downs;
}
