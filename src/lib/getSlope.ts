'use strict';
import { downhill } from './downhill';
import * as Geometry from "./geometry";
import type { HInterface } from './hinterface';
import { zero } from './zero';

export function getSlope(h: HInterface) {
  const dh = downhill(h);
  const slope = zero(h.mesh);
  for (let i = 0; i < h.length; i++) {
    const s = Geometry.trislope(h, i);
    slope[i] = Math.sqrt(s[0] * s[0] + s[1] * s[1]);
    continue;
    // if (dh[i] < 0) {
    //   slope[i] = 0;
    // } else {
    //   slope[i] = (h[i] - h[dh[i]]) / distance(h.mesh, i, dh[i]);
    // }
  }
  return slope;
}
