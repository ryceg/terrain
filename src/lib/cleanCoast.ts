'use strict';
import * as Geometry from "./geometry";
import type { HInterface } from './hinterface';
import { zero } from './zero';

export function cleanCoast(h: HInterface, iters = 3) {
  for (let iter = 0; iter < iters; iter++) {
    let newh = zero(h.mesh);
    for (let i = 0; i < h.length; i++) {
      newh[i] = h[i];
      const nbs = Geometry.neighbors(h.mesh, i);
      if (h[i] <= 0 || nbs.length != 3)
        continue;
      let count = 0;
      let best = -999999;
      for (let j = 0; j < nbs.length; j++) {
        if (h[nbs[j]] > 0) {
          count++;
        } else if (h[nbs[j]] > best) {
          best = h[nbs[j]];
        }
      }
      if (count > 1)
        continue;
      newh[i] = best / 2;
    }
    h = newh;
    newh = zero(h.mesh);
    for (let i = 0; i < h.length; i++) {
      newh[i] = h[i];
      const nbs = Geometry.neighbors(h.mesh, i);
      if (h[i] > 0 || nbs.length != 3)
        continue;
      let count = 0;
      let best = 999999;
      for (let j = 0; j < nbs.length; j++) {
        if (h[nbs[j]] <= 0) {
          count++;
        } else if (h[nbs[j]] < best) {
          best = h[nbs[j]];
        }
      }
      if (count > 1)
        continue;
      newh[i] = best / 2;
    }
    h = newh;
  }
  return h;
}
