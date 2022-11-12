'use strict';
import { downhill } from './downhill';
import * as Geometry from './geometry';
import type { HInterface } from './hinterface';

/**
 * findSinks - find the bottoms of all sinks
 *	for each point ... find the bottom of the slope
 *		if it is an edge, sinks[i] = -2
 #		if it is a local minimum sinks[i] = minimum node #
 *
 * @param	height map
 *
 * NOTE: this appears to be unused
 */
export function findSinks(h: HInterface) {
	const dh = downhill(h);
	const sinks = [];
	for (let i = 0; i < dh.length; i++) {
		let node = i;
		while (true) {
			// stop when we hit an edge
			if (Geometry.isEdge(h.mesh, node)) {
				sinks[i] = -2;
				break;
			}
			// stop when we hit a local minimum
			if (dh[node] === -1) {
				sinks[i] = node;
				break;
			}
			// move down-hill
			node = dh[node];
		}
	}
}
