'use strict';
import { downhill } from './downhill';
import * as Geometry from "./geometry";
import { getFlux } from './getFlux';
import type { HInterface } from './hinterface';
import { mergeSegments } from "./mergeSegments";
import { relaxPath } from "./relaxPath";


export function getRivers(h: HInterface, limit: number): number[][] {
  const dh = downhill(h);
  const flux = getFlux(h);
  const links = [];
  let above = 0;
  for (let i = 0; i < h.length; i++) {
    if (h[i] > 0)
      above++;
  }
  limit *= above / h.length;
  for (let i = 0; i < dh.length; i++) {
    if (Geometry.isNearEdge(h.mesh, i))
      continue;
    if (flux[i] > limit && h[i] > 0 && dh[i] >= 0) {
      const up = h.mesh.vxs[i];
      const down = h.mesh.vxs[dh[i]];
      if (h[dh[i]] > 0) {
        links.push([up, down]);
      } else {
        links.push([up, [(up[0] + down[0]) / 2, (up[1] + down[1]) / 2]]);
      }
    }
  }
  return mergeSegments(links).map(relaxPath);
}
