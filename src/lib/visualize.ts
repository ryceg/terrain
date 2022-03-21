'use strict';

import * as d3 from "d3";
import * as Draw from "./draw";
import * as Geometry from "./geometry";
import type { HInterface } from './hinterface';
import type { Pts } from './pts';
import type RenderData from './renderData';
import * as Terrain from "./terrain";

export function visualizeBorders(svg, render: RenderData) {
  const links = Terrain.getBorders(render);
  Draw.drawPaths(svg, 'border', links);
}

export function visualizeCities(svg, render: RenderData) {
  const cities = render.cities;
  const h = render.h;
  const n = render.params.nterrs;

  const circs = svg.selectAll('circle.city').data(cities);
  circs.enter()
    .append('circle')
    .classed('city', true);
  circs.exit()
    .remove();
  svg.selectAll('circle.city')
    .attr('cx', function (d) { return 1000 * h.mesh.vxs[d][0] })
    .attr('cy', function (d) { return 1000 * h.mesh.vxs[d][1] })
    .attr('r', function (d, i) { return i >= n ? 4 : 10 })
    .style('fill', 'white')
    .style('stroke-width', 5)
    .style('stroke-linecap', 'round')
    .style('stroke', 'black')
    .raise();
}

export function visualizeContour(svg, h: HInterface, level = 0) {
  const links = Terrain.contour(h, level);
  Draw.drawPaths(svg, 'coast', links);
}

export function visualizeDownhill(svg, h: HInterface) {
  const links = Terrain.getRivers(h, 0.01);
  Draw.drawPaths(svg, 'river', links);
}

export function visualizePoints(svg, pts: Pts) {
  const circle = svg.selectAll('circle').data(pts);
  circle.enter()
    .append('circle');
  circle.exit().remove();
  svg.selectAll('circle')
    .attr('cx', function (d) { return 1000 * d[0] })
    .attr('cy', function (d) { return 1000 * d[1] })
    .attr('r', 100 / Math.sqrt(pts.length));
}

export function visualizeSlopes(svg, render: RenderData) {
  const h = render.h;
  const strokes = [];
  const r = 0.25 / Math.sqrt(h.length);
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
      let n = Math.floor(Math.abs(l * s / r));
      l /= n;
      if (n > 4) n = 4;
      for (let j = 0; j < n; j++) {
        const u = Geometry.rnorm() * r;
        const v = Geometry.rnorm() * r;
        strokes.push([[x + u - l, y + v + l * s], [x + u + l, y + v - l * s]]);
      }
    } else {
      strokes.push([[x - l, y + l * s], [x + l, y - l * s]]);
    }
  }
  const lines = svg.selectAll('line.slope').data(strokes)
  lines.enter()
    .append('line')
    .classed('slope', true);
  lines.exit()
    .remove();
  svg.selectAll('line.slope')
    .attr('x1', function (d) { return 1000 * d[0][0] })
    .attr('y1', function (d) { return 1000 * d[0][1] })
    .attr('x2', function (d) { return 1000 * d[1][0] })
    .attr('y2', function (d) { return 1000 * d[1][1] })
}

export function visualizeVoronoi(svg, field: HInterface, lo?: number, hi?: number) {
  if (hi === undefined) hi = d3.max(field) + 1e-9;
  if (lo === undefined) lo = d3.min(field) - 1e-9;
  const mappedvals = field.map(function (x) { return x > hi ? 1 : x < lo ? 0 : (x - lo) / (hi - lo) });
  const tris = svg.selectAll('path.field').data(field.mesh.tris)
  tris.enter()
    .append('path')
    .classed('field', true);

  tris.exit()
    .remove();

  svg.selectAll('path.field')
    .attr('d', Draw.makeD3Path)
    .style('fill', function (d, i) {
      return d3.interpolateViridis(mappedvals[i]);
    });
}
