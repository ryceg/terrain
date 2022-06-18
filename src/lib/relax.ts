'use strict';
import * as d3 from 'd3';
import * as Geometry from "./geometry";
import type { HInterface } from './hinterface';
import { zero } from './zero';

export function relax(h: HInterface) {
  const newh = zero(h.mesh);
  for (let i = 0; i < h.length; i++) {
    const nbs = Geometry.neighbors(h.mesh, i);
    if (nbs.length < 3) {
      newh[i] = 0;
      continue;
    }
    newh[i] = d3.mean(nbs.map(function (j) { return h[j]; }));
  }
  return newh;
}
