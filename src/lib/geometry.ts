'use strict';

import * as d3 from 'd3';
import { voronoi as d3_voronoi } from 'd3-voronoi';
import { defaultExtent } from './defaultExtent';
import type { HInterface } from './hinterface';
import type Mesh from './mesh';
import type { Pts } from './pts';

/**
 * rnorm - (kinky) random vector generation
 *
 *	This routine is meant to be called twice, and returns
 *	first an X coordinate, and then a Y coordiante.
 */
export const rnorm: () => number = (function () {
	let z2 = null;
	function rnorm() {
		// if we have a y coordinate, return it
		if (z2 !== null) {
			const tmp = z2;
			z2 = null;
			return tmp;
		}
		// loop until we get a radius <= 1
		let x1 = 0;
		let x2 = 0;
		let w = 2.0;
		while (w >= 1) {
			x1 = runif(-1, 1);
			x2 = runif(-1, 1);
			w = x1 * x1 + x2 * x2;
		}
		w = Math.sqrt((-2 * Math.log(w)) / w);
		z2 = x2 * w;
		return x1 * w;
	}
	return rnorm;
})();

/**
 * centroid - centroid of
 * @param	set of <x,y> points
 * @return	<x,y> centroid coordinates
 */
export function centroid(pts: Pts): [number, number] {
	let x = 0;
	let y = 0;
	for (let i = 0; i < pts.length; i++) {
		x += pts[i][0];
		y += pts[i][1];
	}
	return [x / pts.length, y / pts.length];
}
/**
 * voronoi: compute the Voronoi tesselation for a set or points
 *
 * @param	list of <x,y> coordinates
 * @param	extent (range limits)
 * @param	list of Voronoi regions
 */
export function voronoi(pts: Pts, extent = defaultExtent) {
	const w = extent.width / 2;
	const h = extent.height / 2;
	return d3_voronoi().extent([
		[-w, -h],
		[w, h]
	])(pts);
}

/**
 * slope ... create a sloping height map
 *
 * @param	mesh
 * @param	imposed slope gradient
 */
export function slope(mesh: Mesh, direction: [number, number]): HInterface {
	return mesh.map(function (x) {
		return x[0] * direction[0] + x[1] * direction[1];
	});
}

/**
 * cone ... create centered conical height map
 *	height = slope x radius out from center
 *
 * @param	mesh
 * @param	cone slope (dz/dxy)
 * @return	new height map
 */
export function cone(mesh: Mesh, slope: number): Mesh {
	return mesh.map(function (x) {
		return Math.pow(x[0] * x[0] + x[1] * x[1], 0.5) * slope;
	});
}

/**
 * neighbors - neighbors of a vertex
 *
 * @param	mesh
 * @param	index of point of interest
 * @return	list of indices (of neighboring points)
 */
export function neighbors(mesh: Mesh, i: number) {
	const onbs = mesh.adj[i];
	const nbs: number[] = [];
	for (let i = 0; i < onbs.length; i++) {
		nbs.push(onbs[i]);
	}
	return nbs;
}

/**
 * distance - distance between two points
 *
 * @param	mesh
 * @param	index of first point
 * @param	index of second point
 * @return	(positive) distance between them
 */
export function distance(mesh: Mesh, i: number, j: number): number {
	const p = mesh.vxs[i];
	const q = mesh.vxs[j];
	return Math.sqrt((p[0] - q[0]) * (p[0] - q[0]) + (p[1] - q[1]) * (p[1] - q[1]));
}

/**
 * isedge - is a point on the map edge
 *
 * @param	mesh
 * @param	index of point of interest
 * @return	true ... point is on the edge
 *
 * In the final (triangular) grid points on the edge have
 * only two neighbors, while internal points have 3 or more.
 */
export function isEdge(mesh: Mesh, i: number): boolean {
	return mesh.adj[i].length < 3;
}

/**
 * isnearedge - is a point near the map edge
 * near edge means in the outer 5% of the map
 *
 * @param	mesh
 * @param	index of point of interest
 * @return	true ... point is within 5% of edge
 */
export function isNearEdge(mesh: Mesh, i: number): boolean {
	const x = mesh.vxs[i][0];
	const y = mesh.vxs[i][1];
	const w = mesh.extent.width;
	const h = mesh.extent.height;
	return x < -0.45 * w || x > 0.45 * w || y < -0.45 * h || y > 0.45 * h;
}
/**
 * randomVector - generate a random vector
 *
 * @param	maximum size
 * @return	<x,y> coordinate
 */
export function randomVector(scale: number): [number, number] {
	return [scale * rnorm(), scale * rnorm()];
}
/**
 * quantile (return the n'th highest value)
 *
 * @param	height map
 * @param	target fraction (0-1)
 * @return	height of chosen value
 */
export function quantile(h: HInterface, q: number): number {
	const sortedh = [];
	for (let i = 0; i < h.length; i++) {
		sortedh[i] = h[i];
	}
	sortedh.sort(d3.ascending);
	return d3.quantile(sortedh, q);
}

/**
 * runif: random number within a range
 *
 * @param lo	low end of range
 * @param hi	high end of range
 * @return	number between lo and hi
 */
export function runif(lo: number, hi: number): number {
	return lo + Math.random() * (hi - lo);
}

/**
 * trislope - return the gradient at a point
 *
 * @param	height map
 * @param	index of point of interest
 * @return	<dx,dy> gradient
 */
export function trislope(h: HInterface, i: number): [number, number] {
	const nbs = neighbors(h.mesh, i);
	if (nbs.length !== 3) return [0, 0];
	const p0 = h.mesh.vxs[nbs[0]];
	const p1 = h.mesh.vxs[nbs[1]];
	const p2 = h.mesh.vxs[nbs[2]];

	const x1 = p1[0] - p0[0];
	const x2 = p2[0] - p0[0];
	const y1 = p1[1] - p0[1];
	const y2 = p2[1] - p0[1];

	const det = x1 * y2 - x2 * y1;
	const h1 = h[nbs[1]] - h[nbs[0]];
	const h2 = h[nbs[2]] - h[nbs[0]];

	return [(y2 * h1 - y1 * h2) / det, (-x2 * h1 + x1 * h2) / det];
}
