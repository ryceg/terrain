'use strict';
import * as Geometry from "./geometry";
import { getFlux } from './getFlux';
import type { HInterface } from './hinterface';
import { BinaryHeapStrategy as PriorityQueue } from './priority-queue';
import type { RenderData } from './renderData';

export function getTerritories(render: RenderData) {
  const h = render.h;
  const cities = render.cities;
  let n = render.params.nterrs;
  if (n > render.cities.length)
    n = render.cities.length;
  const flux = getFlux(h);
  const terr: HInterface = [] as HInterface; // this might be the wrong type, just doing it for now
  const queue = new PriorityQueue({ comparator: function (a, b) { return a.score - b.score; } });
  function weight(u, v) {
    const horiz = Geometry.distance(h.mesh, u, v);
    let vert = h[v] - h[u];
    if (vert > 0)
      vert /= 10;
    let diff = 1 + 0.25 * Math.pow(vert / horiz, 2);
    diff += 100 * Math.sqrt(flux[u]);
    if (h[u] <= 0)
      diff = 100;
    if ((h[u] > 0) !== (h[v] > 0))
      return 1000;
    return horiz * diff;
  }
  for (let i = 0; i < n; i++) {
    terr[cities[i]] = cities[i];
    const nbs = Geometry.neighbors(h.mesh, cities[i]);
    for (let j = 0; j < nbs.length; j++) {
      queue.queue({
        score: weight(cities[i], nbs[j]),
        city: cities[i],
        vx: nbs[j]
      });
    }
  }
  while (queue.length) {
    const u = queue.dequeue();
    if (terr[u.vx] !== undefined)
      continue;
    terr[u.vx] = u.city;
    const nbs = Geometry.neighbors(h.mesh, u.vx);
    for (let i = 0; i < nbs.length; i++) {
      const v = nbs[i];
      if (terr[v] !== undefined)
        continue;
      const newdist = weight(u.vx, v);
      queue.queue({
        score: u.score + newdist,
        city: u.city,
        vx: v
      });
    }
  }
  terr.mesh = h.mesh;
  return terr;
}
