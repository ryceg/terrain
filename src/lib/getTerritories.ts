'use strict';
import * as Geometry from './geometry';
import { getFlux } from './getFlux';
import type { HInterface } from './hinterface';
import { BinaryHeapStrategy as PriorityQueue } from './priority-queue';
import type { RenderData } from './renderData';
/**
 * getTerritories - define the territories
 *
 *	Recursively compute the cost of travel outwards
 *	from city, and assign ownership to the most easily
 *	reached capitol (using Priority Queues to ensure
 *	that the easiest option is assigned first)
 *
 * @param	world map and parameters
 * @return	territory map (which city each cell belongs to)
 */
export function getTerritories(render: RenderData) {
	const h = render.h;
	const cities = render.cities;
	let n = render.params.nterrs;
	if (n > render.cities.length) n = render.cities.length;
	const flux = getFlux(h);
	const terr: HInterface = [] as HInterface; // this might be the wrong type, just doing it for now
	const queue = new PriorityQueue({
		comparator: function (a, b) {
			return a.score - b.score;
		}
	});

	/**
	 * weight - difficutly of travel from u to v
	 *		proportional to distance
	 *		proportional to square of slope
	 *		proportional to river width (sqrt flux)
	 *		very hard to go across ocean
	 */
	function weight(u, v) {
		const horiz = Geometry.distance(h.mesh, u, v);
		let vert = h[v] - h[u];
		if (vert > 0) vert /= 10;
		let diff = 1 + 0.25 * Math.pow(vert / horiz, 2);
		diff += 100 * Math.sqrt(flux[u]);
		if (h[u] <= 0) diff = 100;
		if (h[u] > 0 !== h[v] > 0) return 1000;
		return horiz * diff;
	}
	// for each desired territory
	for (let i = 0; i < n; i++) {
		// starts at its capital city
		terr[cities[i]] = cities[i];
		// queue travel to each neighbor
		const nbs = Geometry.neighbors(h.mesh, cities[i]);
		for (let j = 0; j < nbs.length; j++) {
			queue.queue({
				score: weight(cities[i], nbs[j]),
				city: cities[i],
				vx: nbs[j]
			});
		}
	}
	// for each queued city and neighbor
	while (queue.length) {
		const u = queue.dequeue();
		// ignore any cell that has a territory
		if (terr[u.vx] !== undefined) continue;
		// assign this cell to the proximate city
		terr[u.vx] = u.city;
		// for each neighbor of this cell
		const nbs = Geometry.neighbors(h.mesh, u.vx);
		for (let i = 0; i < nbs.length; i++) {
			const v = nbs[i];
			// ignore any cell that has a territory
			if (terr[v] !== undefined) continue;
			const newdist = weight(u.vx, v);
			queue.queue({
				score: u.score + newdist, // incremental cost
				city: u.city,
				vx: v
			});
		}
	}
	terr.mesh = h.mesh;
	return terr;
}
