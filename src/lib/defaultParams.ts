"use strict";

import { defaultExtent } from './defaultExtent';
import type RenderParams from './renderParams';
import { generateCoast } from './terrain';

export const defaultParams: RenderParams = {
  extent: defaultExtent,
  generator: generateCoast,
  npts: 16384,
  ncities: 15,
  nterrs: 5,
  fontSizes: {
    region: 40,
    city: 25,
    town: 20
  }
};
