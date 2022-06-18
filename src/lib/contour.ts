'use strict';
import * as Geometry from "./geometry";
import type { HInterface } from './hinterface';
import { mergeSegments } from "./mergeSegments";


export function contour(h: HInterface, level = 0) {
  const edges = [];
  for (let i = 0; i < h.mesh.edges.length; i++) {
    const e = h.mesh.edges[i];
    if (e[3] === undefined)
      continue;
    if (Geometry.isNearEdge(h.mesh, e[0]) || Geometry.isNearEdge(h.mesh, e[1]))
      continue;
    if ((h[e[0]] > level && h[e[1]] <= level) ||
      (h[e[1]] > level && h[e[0]] <= level)) {
      edges.push([e[2], e[3]]);
    }
  }
  return mergeSegments(edges);
}
