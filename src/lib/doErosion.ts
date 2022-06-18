'use strict';
import { erode } from './erode';
import { fillSinks } from './fillSinks';
import type { HInterface } from './hinterface';

export function doErosion(h: HInterface, amount: number, iterations = 1) {
  h = fillSinks(h);
  for (let i = 0; i < iterations; i++) {
    h = erode(h, amount);
    h = fillSinks(h);
  }
  return h;
}
