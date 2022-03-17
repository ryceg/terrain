'use strict';

import type { City } from './city';
import type { HInterface } from './hinterface';
import type RenderParams from './renderParams';

export default interface RenderData {
  cities?: City[]
  rivers?: any
  coasts?: any
  borders?: any
  terr?: any
  params: RenderParams

  h: HInterface
}
