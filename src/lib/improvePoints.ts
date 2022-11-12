'use strict';
import { defaultExtent } from './defaultExtent';
import * as Geometry from './geometry';
import type { Pts } from './pts';

/**
 * improvePoints: smooth a set of random points
 *
 * @param 	set of <x,y> points
 * @param	number of smoothing iterations
 * @param	extent (range limits)
 * @return	list of smoother <x,y> coordinates
 *
 * each iteration smooths out the distribution of the points
 *	for each point in the set
 *	    generate surrounding Voronoi polygon
 *	    use the centroid of that polygon
 */
export function improvePoints(pts: Pts, n = 1, extent = defaultExtent): Pts {
	for (let i = 0; i < n; i++) {
		pts = Geometry.voronoi(pts, extent).polygons(pts).map(Geometry.centroid);
	}
	return pts;
}
