'use strict';
import type { HInterface } from './hinterface';
import type Mesh from './mesh';
/**
 * zero ... return a heightmap of all zeroes
 *
 * @param	mesh
 * @return	heightmap of all zeroes
 */
export function zero(mesh: Mesh): HInterface {
	const z: HInterface = [] as HInterface;
	for (let i = 0; i < mesh.vxs.length; i++) {
		z[i] = 0;
	}
	z.mesh = mesh;
	return z;
}
