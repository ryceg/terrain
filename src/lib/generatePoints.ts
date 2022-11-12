'use strict';
import { defaultExtent } from './defaultExtent';
import type { Pts } from './pts';

/**
 * generatePoints: generate N random <x,y> points
 *	-0.5 <= x,y < 0.5
 *
 * @param	number of desired points
 * @param	extent (range limits)
 * @return	a list of n tupples
 */
export function generatePoints(n: number, extent = defaultExtent): Pts {
	const pts = [];
	for (let i = 0; i < n; i++) {
		pts.push([(Math.random() - 0.5) * extent.width, (Math.random() - 0.5) * extent.height]);
	}
	return pts;
}
