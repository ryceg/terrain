'use strict';
import { defaultExtent } from './defaultExtent';
import * as Geometry from "./geometry";
import Mesh from './mesh';
import type { Pts } from './pts';
import type Voronoi from './voronoi';

export function makeMesh(pts: Pts, extent = defaultExtent): Mesh {
  const vor: Voronoi = Geometry.voronoi(pts, extent);
  const vxs: number[] = [];
  const vxids = {};
  const adj: number[][] = [];
  const edges: number[][] = [];
  const tris: number[][] = [];

  for (let i = 0; i < vor.edges.length; i++) {
    const e = vor.edges[i];
    if (e === undefined)
      continue;
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
    adj[e0] = adj[e0] || [];
    adj[e0].push(e1);
    adj[e1] = adj[e1] || [];
    adj[e1].push(e0);
    edges.push([e0, e1, e.left, e.right]);
    tris[e0] = tris[e0] || [];
    if (!tris[e0].includes(e.left))
      tris[e0].push(e.left);
    if (e.right && !tris[e0].includes(e.right))
      tris[e0].push(e.right);
    tris[e1] = tris[e1] || [];
    if (!tris[e1].includes(e.left))
      tris[e1].push(e.left);
    if (e.right && !tris[e1].includes(e.right))
      tris[e1].push(e.right);
  }

  const mesh = new Mesh(pts, extent, vor, vxs, adj, tris, edges);

  return mesh;
}
