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
  // I really don't like using the word `map` to refer to something other than the array method.
  map(f) {
    const mapped: any = this.vxs.map(f);
    mapped.mesh = this;
    return mapped;
  }
}
