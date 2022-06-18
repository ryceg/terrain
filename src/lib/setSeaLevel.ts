'use strict';
import * as Geometry from "./geometry";
import type { HInterface } from './hinterface';
import { zero } from './zero';

export function setSeaLevel(h: HInterface, q: number) {
  const newh = zero(h.mesh);
  const delta = Geometry.quantile(h, q);
  for (let i = 0; i < h.length; i++) {
    newh[i] = h[i] - delta;
  }
  return newh;
}
