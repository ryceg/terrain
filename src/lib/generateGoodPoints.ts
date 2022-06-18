'use strict';
import { defaultExtent } from './defaultExtent';
import { generatePoints } from './generatePoints';
import { improvePoints } from './improvePoints';
import type { Pts } from './pts';

export function generateGoodPoints(n: number, extent = defaultExtent): Pts {
  let pts = generatePoints(n, extent);
  pts = pts.sort(function (a, b) {
    return a[0] - b[0];
  });
  return improvePoints(pts, 1, extent);
}
