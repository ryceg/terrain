'use strict';
import type { City } from './city';
import * as Geometry from "./geometry";
import { getFlux } from './getFlux';
import type { HInterface } from './hinterface';
import { map } from './map';

export function cityScore(h: HInterface, cities: City[]): HInterface {
  const score = map(getFlux(h), Math.sqrt);
  for (let i = 0; i < h.length; i++) {
    if (h[i] <= 0 || Geometry.isNearEdge(h.mesh, i)) {
      score[i] = -999999;
      continue;
    }
    score[i] += 0.01 / (1e-9 + Math.abs(h.mesh.vxs[i][0]) - h.mesh.extent.width / 2);
    score[i] += 0.01 / (1e-9 + Math.abs(h.mesh.vxs[i][1]) - h.mesh.extent.height / 2);
    for (let j = 0; j < cities.length; j++) {
      score[i] -= 0.02 / (Geometry.distance(h.mesh, cities[j], i) + 1e-9);
    }
  }
  return score;
}
