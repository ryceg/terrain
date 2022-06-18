'use strict';
import { defaultExtent } from './defaultExtent';
import { generateGoodPoints } from './generateGoodPoints';
import { makeMesh } from './makeMesh';

export function generateGoodMesh(n: number, extent = defaultExtent) {
  const pts = generateGoodPoints(n, extent);
  return makeMesh(pts, extent);
}
