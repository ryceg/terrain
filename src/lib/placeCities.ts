'use strict';
import { placeCity } from './placeCity';
import type { RenderData } from './renderData';

/**
 * placeCities - create the configured number of cities
 *
 * @param	world map and parameters
 * 		updates cities list in world map
 */
export function placeCities(render: RenderData) {
	const params = render.params;
	const n = params.ncities;
	for (let i = 0; i < n; i++) {
		placeCity(render);
	}
}
