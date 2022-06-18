'use strict';
import * as Geometry from "./geometry";
import { mergeSegments } from "./mergeSegments";
import { relaxPath } from "./relaxPath";
import type { Border, RenderData } from './renderData';


export function getBorders(render: RenderData): Border {
  const terr = render.terr;
  const h = render.h;
  const edges = [];
  for (let i = 0; i < terr.mesh.edges.length; i++) {
    const e = terr.mesh.edges[i];
    if (e[3] === undefined)
      continue;
    if (Geometry.isNearEdge(terr.mesh, e[0]) || Geometry.isNearEdge(terr.mesh, e[1]))
      continue;
    if (h[e[0]] < 0 || h[e[1]] < 0)
      continue;
    if (terr[e[0]] !== terr[e[1]]) {
      edges.push([e[2], e[3]]);
    }
  }
  return mergeSegments(edges).map(relaxPath);
}
