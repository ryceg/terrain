'use strict';
import { defaultExtent } from './defaultExtent';
import type { Pts } from './pts';

export function generatePoints(n: number, extent = defaultExtent): Pts {
  const pts = [];
  for (let i = 0; i < n; i++) {
    pts.push([(Math.random() - 0.5) * extent.width, (Math.random() - 0.5) * extent.height]);
  }
  return pts;
}
