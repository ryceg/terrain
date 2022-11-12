'use strict';
import type Mesh from './mesh';
import { zero } from './zero';

/**
 * mountains ... create a mountainous height map
 *	height = (e^-dist/radius)^2
 *
 * @param	mesh
 * @param	number of mountains
 * @param	desired radius
 * @return	new height map
 */
export function mountains(mesh: Mesh, n = 50, r = 0.05) {
	// choose a center location for each desired mountain
	const mounts = [];
	for (let i = 0; i < n; i++) {
		mounts.push([
			mesh.extent.width * (Math.random() - 0.5),
			mesh.extent.height * (Math.random() - 0.5)
		]);
	}
	const newvals = zero(mesh);
	// for each point in mesh
	for (let i = 0; i < mesh.vxs.length; i++) {
		const p = mesh.vxs[i];
		// for each mountain
		for (let j = 0; j < n; j++) {
			const m = mounts[j];
			// compute the height that mounain adds to this point
			newvals[i] += Math.pow(
				Math.exp(-((p[0] - m[0]) * (p[0] - m[0]) + (p[1] - m[1]) * (p[1] - m[1])) / (2 * r * r)),
				2
			);
		}
	}
	return newvals;
}
