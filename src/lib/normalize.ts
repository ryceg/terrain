'use strict';
import * as d3 from 'd3';
import type { HInterface } from './hinterface';
import { map } from './map';

/**
 * normalize ... normalize a height map to (0-1)
 *
 * @param	height map
 * @return	new height map
 */
export function normalize(h: HInterface) {
	const lo = d3.min(h);
	const hi = d3.max(h);
	return map(h, function (x) {
		return (x - lo) / (hi - lo);
	});
}
