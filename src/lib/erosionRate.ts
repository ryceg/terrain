'use strict';
import { getFlux } from './getFlux';
import { getSlope } from './getSlope';
import type { HInterface } from './hinterface';
import { zero } from './zero';

export function erosionRate(h: HInterface) {
  const flux = getFlux(h);
  const slope = getSlope(h);
  const newh = zero(h.mesh);
  for (let i = 0; i < h.length; i++) {
    const river = Math.sqrt(flux[i]) * slope[i];
    const creep = slope[i] * slope[i];
    let total = 1000 * river + creep;
    total = total > 200 ? 200 : total;
    newh[i] = total;
  }
  return newh;
}
