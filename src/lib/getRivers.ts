'use strict';
import { downhill } from './downhill';
import * as Geometry from './geometry';
import { getFlux } from './getFlux';
import type { HInterface } from './hinterface';
import { mergeSegments } from './mergeSegments';
import { relaxPath } from './relaxPath';
import type { River } from './renderData';

/**
 * getRivers - construct water flow paths
 *	threshold water flux is a fraction of the total
 *	rainfall landing above sea-level
 *
 * @param	height map
 * @param	threshold water flux
 * @return	list of (relatively smooth) paths
 */
export function getRivers(h: HInterface, limit: number): River {
	const dh = downhill(h); // where does water flow
	const flux = getFlux(h); // per cell water flux
	const links = []; // list of flow segments
	// compute threshold water flux
	let above = 0;
	for (let i = 0; i < h.length; i++) {
		if (h[i] > 0) above++;
	}
	limit *= above / h.length;

	// figure out which cells contain rivers
	for (let i = 0; i < dh.length; i++) {
		if (Geometry.isNearEdge(h.mesh, i)) continue;
		// above threshold, above sea level, has enough neighbors
		if (flux[i] > limit && h[i] > 0 && dh[i] >= 0) {
			const up = h.mesh.vxs[i]; // this coordinate
			const down = h.mesh.vxs[dh[i]]; // downhill coordinate
			if (h[dh[i]] > 0) {
				// if above sea level, water flows through this cell
				links.push([up, down]);
			} else {
				// if at sea level, water flows 1/2 way into this cell
				links.push([up, [(up[0] + down[0]) / 2, (up[1] + down[1]) / 2]]);
			}
		}
	}
	// merge and smoothe the individual links
	return mergeSegments(links).map(relaxPath);
}
