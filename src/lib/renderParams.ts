'use strict';

import type Extent from './extent';

export default interface RenderParams {
  extent: Extent
  generator: Function
  npts: number
  ncities: number
  nterrs: number
  fontSizes: {
    region: number
    city: number
    town: number
  }
}
