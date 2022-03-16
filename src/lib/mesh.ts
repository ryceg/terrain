'use strict';

import type Extent from './extent';
import type { Pts } from './pts';
import type Voronoi from './voronoi';

export default interface Mesh {
  pts: Pts
  vor: Voronoi
  vxs: number[]
  adj: number[][]
  tris: number[][]
  edges: number[][]
  extent: Extent
}
