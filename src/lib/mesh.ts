'use strict';

import type Extent from './extent';
import type { Pts } from './pts';
import type Voronoi from './voronoi';

export default class Mesh {
  pts: Pts;
  vor: Voronoi;
  vxs: number[];
  adj: number[][];
  tris: number[][];
  edges: number[][];
  extent: Extent;

  map(f) {
    let mapped: any = this.vxs.map(f);
    mapped.mesh = this;
    return mapped;
  }
}
