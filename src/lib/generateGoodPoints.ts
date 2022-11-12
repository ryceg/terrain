'use strict';
import { defaultExtent } from './defaultExtent';
import { generatePoints } from './generatePoints';
import { improvePoints } from './improvePoints';
import type { Pts } from './pts';

/**
 * generateGoodPoints: generate attractive random grid
 *
 * @param	number of points
 * @param	extent (range limits)
 * @return	list of <x,y> coordinates
 *
 * 1. generate a set of random points in the map
 * 2. run one improvement iteration on them
 */
export function generateGoodPoints(n: number, extent = defaultExtent): Pts {
	let pts = generatePoints(n, extent);
	pts = pts.sort(function (a, b) {
		return a[0] - b[0];
	});
	return improvePoints(pts, 1, extent);
}
