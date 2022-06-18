'use strict';
import type { HInterface } from './hinterface';
import { zero } from './zero';

export function dropEdge(h: HInterface, p = 4) {
  const newh = zero(h.mesh);
  for (let i = 0; i < h.length; i++) {
    const v = h.mesh.vxs[i];
    const x = 2.4 * v[0] / h.mesh.extent.width;
    const y = 2.4 * v[1] / h.mesh.extent.height;
    newh[i] = h[i] - Math.exp(10 * (Math.pow(Math.pow(x, p) + Math.pow(y, p), 1 / p) - 1));
  }
  return newh;
}
