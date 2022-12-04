'use strict';

import * as d3 from 'd3';
import * as contour from './contour';
import * as Draw from './draw';
import * as Geometry from './geometry';
import * as getBorders from './getBorders';
import * as getRivers from './getRivers';
import type { HInterface } from './hinterface';
import type { Pts } from './pts';
import type { RenderData } from './renderData';
/**
 * visualizeBorders - locate territories and draw borders
 *
 * @param	height map
 * @param	list of cities
 * @parm	max # of territories
 */
export function visualizeBorders(svg, render: RenderData) {
	const links = getBorders.getBorders(render);
	Draw.drawPaths(svg, 'border', links);
}
/**
 * visualizeCities
 *
 * @param	stroke vector graphics
 * @param	world map info
 */
export function visualizeCities(svg, render: RenderData) {
	const cities = render.cities;
	const h = render.h;
	const n = render.params.nterrs;

	// remove all existing city circles from map
	const circs = svg.selectAll('circle.city').data(cities);
	circs.enter().append('circle').classed('city', true);
	circs.exit().remove();
	// larger circles for capitols
	svg
		.selectAll('circle.city')
		.attr('cx', function (d) {
			return 1000 * h.mesh.vxs[d][0];
		})
		.attr('cy', function (d) {
			return 1000 * h.mesh.vxs[d][1];
		})
		.attr('r', function (d, i) {
			return i >= n ? 4 : 10;
		})
		.style('fill', 'white')
		.style('stroke-width', 5)
		.style('stroke-linecap', 'round')
		.style('stroke', 'black')
		.raise();
}

/**
 * visualizeContour - display a contour line
 *
 * @param	height map
 * @param	contour level (e.g. 0.5)
 * @param level defaults to sea level
 */
export function visualizeContour(svg, h: HInterface, level = 0) {
	const links = contour.contour(h, level);
	Draw.drawPaths(svg, 'coast', links);
}

/**
 * visualizeDownHill - display water paths
 *	rivers are cells w/99th percentile water flow
 *
 * @param	height map
 */
export function visualizeDownhill(svg, h: HInterface) {
	const links = getRivers.getRivers(h, 0.01);
	Draw.drawPaths(svg, 'river', links);
}

/**
 * visualizePoints - plot points on a map
 *
 * @param	SVG field
 *		(1000x1000, centered <0,0>)
 * @param	list of <x,y> coordinates
 *		in range <-0.5,-0.5> to <0.5,0.5>
 */
export function visualizePoints(svg, pts: Pts) {
	// remove all exising circles from the SVG
	const circle = svg.selectAll('circle').data(pts);
	circle.enter().append('circle');
	circle.exit().remove();
	// translate 0-1 coordinates into 1Kx1K coordinaces
	// with radius of 1% of field with
	svg // @TODO try changing this to d3
		.selectAll('circle')
		.attr('cx', function (d) {
			return 1000 * d[0];
		})
		.attr('cy', function (d) {
			return 1000 * d[1];
		})
		.attr('r', 100 / Math.sqrt(pts.length));
}

export function visualizeSlopes(svg, h: HInterface) {
	const strokes = [];
	const r = 0.25 / Math.sqrt(h.length);
	console.log('visualise slopes');
	console.log({ h });
	console.log(h.length);
	for (let i = 0; i < h.length; i++) {
		if (h[i] <= 0 || Geometry.isNearEdge(h.mesh, i)) continue;
		const nbs = Geometry.neighbors(h.mesh, i);
		nbs.push(i);
		let s = 0;
		let s2 = 0;
		for (let j = 0; j < nbs.length; j++) {
			const slopes = Geometry.trislope(h, nbs[j]);
			s += slopes[0] / 10;
			s2 += slopes[1];
		}
		s /= nbs.length;
		s2 /= nbs.length;
		if (Math.abs(s) < Geometry.runif(0.1, 0.4)) continue;
		let l = r * Geometry.runif(1, 2) * (1 - 0.2 * Math.pow(Math.atan(s), 2)) * Math.exp(s2 / 100);
		const x = h.mesh.vxs[i][0];
		const y = h.mesh.vxs[i][1];
		if (Math.abs(l * s) > 2 * r) {
			let n = Math.floor(Math.abs((l * s) / r));
			l /= n;
			if (n > 4) n = 4;
			for (let j = 0; j < n; j++) {
				const u = Geometry.rnorm() * r;
				const v = Geometry.rnorm() * r;
				strokes.push([
					[x + u - l, y + v + l * s],
					[x + u + l, y + v - l * s]
				]);
			}
		} else {
			strokes.push([
				[x - l, y + l * s],
				[x + l, y - l * s]
			]);
		}
	}
	const lines = svg.selectAll('line.slope').data(strokes);
	lines.enter().append('line').classed('slope', true);
	lines.exit().remove();
	svg
		.selectAll('line.slope')
		.attr('x1', function (d) {
			return 1000 * d[0][0];
		})
		.attr('y1', function (d) {
			return 1000 * d[0][1];
		})
		.attr('x2', function (d) {
			return 1000 * d[1][0];
		})
		.attr('y2', function (d) {
			return 1000 * d[1][1];
		});
}
/**
 * visualizeVoronoi - display a height map
 *
 * @param	SVG field
 * @param	height map to be rendered
 * @param	low value (to be displayed as zero)
 * @param	high value (to be displayed as one)
 */
export function visualizeVoronoi(svg, field: HInterface, lo?: number, hi?: number) {
	// generate a map of values to be plotted
	if (hi === undefined) hi = d3.max(field) + 1e-9;
	if (lo === undefined) lo = d3.min(field) - 1e-9;
	const mappedvals = field.map(function (x) {
		return x > hi ? 1 : x < lo ? 0 : (x - lo) / (hi - lo);
	});
	// remove all existing field path lines
	const tris = svg.selectAll('path.field').data(field.mesh.tris);
	tris.enter().append('path').classed('field', true);

	tris.exit().remove();
	// draw a line along the connecting path
	//	using the Veridis value-to-color mapping
	svg
		.selectAll('path.field')
		.attr('d', Draw.makeD3Path)
		.style('fill', function (d, i) {
			return d3.interpolateViridis(mappedvals[i]);
		});
}
