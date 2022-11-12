'use strict';

import type Extent from './extent';
import type { Pts } from './pts';
import type Voronoi from './voronoi';

/**
 * @module mesh ... functions to generate the basic map
 *
 *	a mesh is a triangular tessalation of the map.
 *	a mesh includes:
 *		pts	... the original well spaced points
 *		vor	... Voronoi tesselation of those points
 *		vxs	... <x,y> coordinate of each Voronoi vertex
 *		adj	... list of vertex indices of neighors of each vertex
 *		tris	... list of <x,y> coordinates neighbors of each vertex
 *
 *		edges	... list of [index, index, <x,y>, <x,y>] tupples
 *
 *	O'Leary observed that a map created on a square grid never
 *	loses its regularity, so he wanted to build the map on an
 *	irregular grid.  But he found randomly chosen grids to be
 *	too irregular.  Mesh generation implements his compromise.
 *
 *	1. He starts by generating N completely randomly chosen points.
 *	   But these turn out to be a little to clumpy, so he smoothes
 *	   them out (improves them) by finding the Voronoi polygons
 *	   around those points and using their vertices.
 *
 *	2. He uses those (improved) points as the centers for a
 *	   second Voronoi tesselation.  The edges of those polygons
 *	   are then converted into a triangular grid
 *
 * NOTE: <x,y> coordinates are relative to the center of the map
 */
export default class Mesh {
	pts: Pts;
	vor: Voronoi;
	vxs: number[];
	adj: number[][];
	tris: number[][];
	edges: number[][];
	extent: Extent;
	/*
  * mesh.map(f) applies `f` to every vertex in mesh
  @note I really don't like using the word `map` to refer to something other than the array method.
  */
	map(f) {
		const mapped: any = this.vxs.map(f);
		mapped.mesh = this;
		return mapped;
	}
	constructor(
		pts: Pts,
		extent: Extent,
		vor: Voronoi,
		vxs: number[],
		adj: number[][],
		tris: number[][],
		edges: number[][]
	) {
		this.pts = pts;
		this.vor = vor;
		this.vxs = vxs;
		this.adj = adj;
		this.tris = tris;
		this.edges = edges;
		this.extent = extent;
	}
}
