'use strict';
import * as d3 from 'd3';
import type { HInterface } from './hinterface';
import { map } from './map';

export function normalize(h: HInterface) {
  const lo = d3.min(h);
  const hi = d3.max(h);
  return map(h, function (x) { return (x - lo) / (hi - lo); });
}
