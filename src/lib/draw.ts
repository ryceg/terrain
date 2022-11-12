'use strict';

import * as d3 from 'd3';
/**
 * makeD3Path - construct path connecting a set of points
 *	start at first point, draw line to each subsequent point
 *
 * @param	list of <x,y> coordinates
 * @return	string representation of connecting path
 */
export function makeD3Path(path) {
	const p = d3.path();
	p.moveTo(1000 * path[0][0], 1000 * path[0][1]);
	for (let i = 1; i < path.length; i++) {
		p.lineTo(1000 * path[i][0], 1000 * path[i][1]);
	}
	return p.toString();
}
/**
 * drawPaths - draw line connecting a set of points
 *
 * @param	SVG field
 * @param	class of path to draw
 * @param	list of <x,y> coordinates
 */
export function drawPaths(svg, cls: string, paths) {
	// remove all existing paths from the SVG
	paths = svg.selectAll('path.' + cls).data(paths);
	paths.enter().append('path').classed(cls, true);
	paths.exit().remove();
	// draw line along the connecting path
	svg.selectAll('path.' + cls).attr('d', makeD3Path);
}
