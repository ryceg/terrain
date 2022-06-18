'use strict';
import type { HInterface } from './hinterface';

export function map(h: HInterface, f) {
  const newh: HInterface = h.map(f) as HInterface;
  newh.mesh = h.mesh;
  return newh;
}
