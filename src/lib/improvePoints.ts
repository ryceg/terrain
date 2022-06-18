'use strict';
import { defaultExtent } from './defaultExtent';
import * as Geometry from "./geometry";
import type { Pts } from './pts';

export function improvePoints(pts: Pts, n = 1, extent = defaultExtent): Pts {
  for (let i = 0; i < n; i++) {
    pts = Geometry.voronoi(pts, extent)
      .polygons(pts)
      .map(Geometry.centroid);
  }
  return pts;
}
