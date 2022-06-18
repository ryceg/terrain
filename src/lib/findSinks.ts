'use strict';
import { downhill } from './downhill';
import * as Geometry from "./geometry";
import type { HInterface } from './hinterface';

function findSinks(h: HInterface) {
  const dh = downhill(h);
  const sinks = [];
  for (let i = 0; i < dh.length; i++) {
    let node = i;
    while (true) {
      if (Geometry.isEdge(h.mesh, node)) {
        sinks[i] = -2;
        break;
      }
      if (dh[node] === -1) {
        sinks[i] = node;
        break;
      }
      node = dh[node];
    }
  }
}
