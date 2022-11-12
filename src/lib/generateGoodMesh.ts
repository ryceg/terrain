'use strict';
import { defaultExtent } from './defaultExtent';
import { generateGoodPoints } from './generateGoodPoints';
import { makeMesh } from './makeMesh';

/**
 * generateGoodMesh - top level mesh generation
 *
 * @param	number of desired points
 * @param	extent (size limits)
 * @return	mesh
 */
export function generateGoodMesh(n: number, extent = defaultExtent) {
	const pts = generateGoodPoints(n, extent);
	return makeMesh(pts, extent);
}
