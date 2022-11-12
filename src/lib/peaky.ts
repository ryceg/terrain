'use strict';
import type { HInterface } from './hinterface';
import { map } from './map';
import { normalize } from './normalize';

/**
 * peaky ... exaggerate the vertical relief
 *
 *	replace each height with its square root
 *	leaves mountains high, but flattens low-lands
 *
 * @param	height map
 * @return	new (normalized) height map
 */
export function peaky(h: HInterface) {
	return map(normalize(h), Math.sqrt);
}
