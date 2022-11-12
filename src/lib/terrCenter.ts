'use strict';
import type { City } from './city';
import type { HInterface } from './hinterface';

/**
 * terrCenter - find centroid of teritory
 *	average the x/y coordinates of every point in territory
 *
 * @param	height map
 * @param	list of territories
 * @param	desired city
 * @param	ignore ocean?
 * @return	<x,y> of territory centroid
 */
export function terrCenter(h: HInterface, terr, city: City, landOnly: boolean): [number, number] {
	let x = 0;
	let y = 0;
	let n = 0;
	for (let i = 0; i < terr.length; i++) {
		if (terr[i] !== city) continue;
		if (landOnly && h[i] <= 0) continue;
		x += terr.mesh.vxs[i][0];
		y += terr.mesh.vxs[i][1];
		n++;
	}
	return [x / n, y / n];
}
