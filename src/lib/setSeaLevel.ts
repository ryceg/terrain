'use strict';
import * as Geometry from './geometry';
import type { HInterface } from './hinterface';
import { zero } from './zero';
/**
 * setSeaLevel ... readjust heights relative to sea-level
 *
 * @param	height map
 * @param	sea level height (0-1)
 * @return	new height map
 */
export function setSeaLevel(h: HInterface, q: number) {
	const newh = zero(h.mesh);
	// find the sea level altitude
	const delta = Geometry.quantile(h, q);
	// subtract that altitude from every value
	for (let i = 0; i < h.length; i++) {
		newh[i] = h[i] - delta;
	}
	return newh;
}
