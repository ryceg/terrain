'use strict';
import { erode } from './erode';
import { fillSinks } from './fillSinks';
import type { HInterface } from './hinterface';

/**
 * doErosion - erode rivers and fill depressions
 *
 * @param	height map
 * @param	max erosion amount
 * @param	number of erosion cycles
 * @return	updated height map
 */
export function doErosion(h: HInterface, amount: number, iterations = 1) {
	h = fillSinks(h);
	for (let i = 0; i < iterations; i++) {
		h = erode(h, amount);
		h = fillSinks(h);
	}
	return h;
}
