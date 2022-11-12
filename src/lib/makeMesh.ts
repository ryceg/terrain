'use strict';
import { defaultExtent } from './defaultExtent';
import * as Geometry from './geometry';
import Mesh from './mesh';
import type { Pts } from './pts';
import type Voronoi from './voronoi';

/**
 * makeMesh - turn a set of well distributed points into a mesh
 *
 * @param	list of <x,y> coordinates
 * @param	extent (size range)
 */
export function makeMesh(pts: Pts, extent = defaultExtent): Mesh {
	// compute the Voronoi polygons
	const vor: Voronoi = Geometry.voronoi(pts, extent);
	const vxs: number[] = []; // vertex locations
	const vxids = {}; // vertex ID #s
	const adj: number[][] = []; // adjacent vertices
	const edges: number[][] = []; // list of vertex IDs and positions
	const tris: number[][] = []; // coordinates of neighbors of this vertex
	// for each edge of each Voronoi polygon
	for (let i = 0; i < vor.edges.length; i++) {
		// get the two end points of this edge
		const e = vor.edges[i];
		if (e === undefined) continue;
		// lookup (or assign) their vertex IDs
		let e0 = vxids[e[0]];
		let e1 = vxids[e[1]];
		if (e0 === undefined) {
			e0 = vxs.length;
			vxids[e[0]] = e0;
			vxs.push(e[0]);
		}
		if (e1 === undefined) {
			e1 = vxs.length;
			vxids[e[1]] = e1;
			vxs.push(e[1]);
		}
		// note that each end-point is adjacent to the other
		adj[e0] = adj[e0] || [];
		adj[e0].push(e1);
		adj[e1] = adj[e1] || [];
		adj[e1].push(e0);
		// add indices and coordinates to known edges
		edges.push([e0, e1, e.left, e.right]);
		// note all edges entering the left end point
		tris[e0] = tris[e0] || [];
		if (!tris[e0].includes(e.left)) tris[e0].push(e.left);
		if (e.right && !tris[e0].includes(e.right)) tris[e0].push(e.right);
		// note all edges entering the right end point
		tris[e1] = tris[e1] || [];
		if (!tris[e1].includes(e.left)) tris[e1].push(e.left);
		if (e.right && !tris[e1].includes(e.right)) tris[e1].push(e.right);
	}

	// the new mesh contains all of these things
	const mesh = new Mesh(pts, extent, vor, vxs, adj, tris, edges);

	return mesh;
}
