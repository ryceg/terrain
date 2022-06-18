'use strict';
import random from 'random';
import { defaultExtent } from './defaultExtent';
import type { Pts } from './pts';

export function generatePoints(n: number, extent = defaultExtent): Pts {
  const pts = [];
  for (let i = 0; i < n; i++) {
    pts.push([(random.float(0, 1) - 0.5) * extent.width, (random.float(0, 1) - 0.5) * extent.height]);
  }
  return pts;
}
