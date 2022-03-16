'use strict';

import type Extent from './extent';

export default interface RenderParams {
  extent: Extent
  generator(): any[]
  npts: number
  ncities: number
  nterrs: number
  fontSizes: {
    region: number
    city: number
    town: number
  }
}
