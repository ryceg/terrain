'use strict';

import type City from './city';
import type Heightmap from './heightMap';
import type RenderParams from './renderParams';

export default interface Render {
  cities?: City[]
  rivers?: any
  coasts?: any
  borders?: any
  terr?: any
  params: RenderParams

  h: Heightmap
}
