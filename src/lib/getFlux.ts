'use strict';
import { downhill } from './downhill';
import type { HInterface } from './hinterface';
import { zero } from './zero';

export function getFlux(h: HInterface) {
  const dh = downhill(h);
  const idxs = [];
  const flux = zero(h.mesh);
  for (let i = 0; i < h.length; i++) {
    idxs[i] = i;
    flux[i] = 1 / h.length;
  }
  idxs.sort(function (a, b) {
    return h[b] - h[a];
  });
  for (let i = 0; i < h.length; i++) {
    const j = idxs[i];
    if (dh[j] >= 0) {
      flux[dh[j]] += flux[j];
    }
  }
  return flux;
}
