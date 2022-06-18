'use strict';
import * as Geometry from "./geometry";
import type { HInterface } from './hinterface';
import { zero } from './zero';

export function fillSinks(h: HInterface, epsilon = 1e-5) {
  const infinity = 999999;
  const newh = zero(h.mesh);
  for (let i = 0; i < h.length; i++) {
    if (Geometry.isNearEdge(h.mesh, i)) {
      newh[i] = h[i];
    } else {
      newh[i] = infinity;
    }
  }
  while (true) {
    let changed = false;
    for (let i = 0; i < h.length; i++) {
      if (newh[i] === h[i])
        continue;
      const nbs = Geometry.neighbors(h.mesh, i);
      for (let j = 0; j < nbs.length; j++) {
        if (h[i] >= newh[nbs[j]] + epsilon) {
          newh[i] = h[i];
          changed = true;
          break;
        }
        const oh = newh[nbs[j]] + epsilon;
        if ((newh[i] > oh) && (oh > h[i])) {
          newh[i] = oh;
          changed = true;
        }
      }
    }
    if (!changed)
      return newh;
  }
}
