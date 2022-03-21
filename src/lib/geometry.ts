'use strict';

import * as d3 from "d3";
import { voronoi as d3_voronoi } from 'd3-voronoi';
import random from 'random';
import { defaultExtent } from './defaultExtent';
import type { HInterface } from './hinterface';
import type Mesh from './mesh';
import type { Pts } from './pts';

export const rnorm = (function () {
  let z2 = null;
  function rnorm() {
    if (z2 != null) {
      const tmp = z2;
      z2 = null;
      return tmp;
    }
    let x1 = 0;
    let x2 = 0;
    let w = 2.0;
    while (w >= 1) {
      x1 = runif(-1, 1);
      x2 = runif(-1, 1);
      w = x1 * x1 + x2 * x2;
    }
    w = Math.sqrt(-2 * Math.log(w) / w);
    z2 = x2 * w;
    return x1 * w;
  }
  return rnorm;
})();

export function centroid(pts: Pts): number[] {
  let x = 0;
  let y = 0;
  for (let i = 0; i < pts.length; i++) {
    x += pts[i][0];
    y += pts[i][1];
  }
  return [x / pts.length, y / pts.length];
}

export function voronoi(pts: Pts, extent = defaultExtent) {
  const w = extent.width / 2;
  const h = extent.height / 2;
  return d3_voronoi().extent([[-w, -h], [w, h]])(pts);
}

export function slope(mesh: Mesh, direction): HInterface {
  return mesh.map(function (x) {
    return x[0] * direction[0] + x[1] * direction[1];
  });
}

export function cone(mesh: Mesh, slope: number) {
  return mesh.map(function (x) {
    return Math.pow(x[0] * x[0] + x[1] * x[1], 0.5) * slope;
  });
}

export function neighbors(mesh: Mesh, i: number) {
  const onbs = mesh.adj[i];
  const nbs: number[] = [];
  for (let i = 0; i < onbs.length; i++) {
    nbs.push(onbs[i]);
  }
  return nbs;
}

export function distance(mesh: Mesh, i: number, j: number) {
  const p = mesh.vxs[i];
  const q = mesh.vxs[j];
  return Math.sqrt((p[0] - q[0]) * (p[0] - q[0]) + (p[1] - q[1]) * (p[1] - q[1]));
}

export function isEdge(mesh: Mesh, i: number) {
  return (mesh.adj[i].length < 3);
}

export function isNearEdge(mesh: Mesh, i: number) {
  const x = mesh.vxs[i][0];
  const y = mesh.vxs[i][1];
  const w = mesh.extent.width;
  const h = mesh.extent.height;
  return x < -0.45 * w || x > 0.45 * w || y < -0.45 * h || y > 0.45 * h;
}

export function randomVector(scale: number): number[] {
  return [scale * rnorm(), scale * rnorm()];
}

export function quantile(h: HInterface, q) {
  const sortedh = [];
  for (let i = 0; i < h.length; i++) {
    sortedh[i] = h[i];
  }
  sortedh.sort(d3.ascending);
  return d3.quantile(sortedh, q);
}

export function runif(lo: number, hi: number): number {
  return lo + random.float(0, 1) * (hi - lo);
}

export function trislope(h: HInterface, i: number) {
  const nbs = neighbors(h.mesh, i);
  if (nbs.length != 3) return [0, 0];
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

  return [(y2 * h1 - y1 * h2) / det,
  (-x2 * h1 + x1 * h2) / det];
}
