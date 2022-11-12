'use strict';
import { cityScore } from './cityScore';
import type { RenderData } from './renderData';
/**
 * placeCity -	compute scores and place a city in the best location
 *
 * @param	world map and parameters
 * 		updates cities list in world map
 */
export function placeCity(render: RenderData) {
	render.cities = render.cities || [];
	const score = cityScore(render.h, render.cities);
	let bestScore = -999999;
	let bestCity = 0;
	for (let i = 0; i < score.length; i++) {
		if (score[i] > bestScore) {
			bestScore = score[i];
			bestCity = i;
		}
	}
	render.cities.push(bestCity);
}
