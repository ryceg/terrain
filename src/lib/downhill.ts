'use strict';
import * as Geometry from "./geometry";
import type { HInterface } from './hinterface';

export function downhill(h: HInterface) {
  if (h.downhill)
    return h.downhill;

  function downfrom(i): number | number[] {
    if (Geometry.isEdge(h.mesh, i))
      return -2; // this is clearly meant to be an error code
    let best = -1; // this is another error code
    let besth = h[i];
    const nbs = Geometry.neighbors(h.mesh, i);
    for (let j = 0; j < nbs.length; j++) {
      if (h[nbs[j]] < besth) {
        besth = h[nbs[j]];
        best = nbs[j];
      }
    }
    return best; // this is either a point or a -1
  }

  const downs = [];
  for (let i = 0; i < h.length; i++) {
    downs[i] = downfrom(i);
  }
  h.downhill = downs;

  return downs;
}
