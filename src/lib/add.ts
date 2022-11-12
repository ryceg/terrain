'use strict';
import type { HInterface } from './hinterface';
import type Mesh from './mesh';
import { zero } from './zero';
/**
 * add ... sum multiple height maps
 *
 * @param	first map
 * @param	... n'th map
 * @return	new height map (sum of args)
 */
export function add(...args: [HInterface, Mesh, HInterface]) {
	const n = args[0].length;
	const newvals = zero(args[0].mesh);
	// for each point in mesh
	for (let i = 0; i < n; i++) {
		// for each map
		for (let j = 0; j < args.length; j++) {
			newvals[i] += args[j][i];
		}
	}
	return newvals;
}
