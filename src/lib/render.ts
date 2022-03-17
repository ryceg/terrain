'use strict';

import type { City } from './city';
import type RenderParams from './renderParams';
import type { HInterface } from './terrain';

export default interface Render {
  cities?: City[]
  rivers?: any
  coasts?: any
  borders?: any
  terr?: any
  params: RenderParams

  h: HInterface
}
