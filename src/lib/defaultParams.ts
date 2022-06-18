"use strict";

import { defaultExtent } from './defaultExtent';
import { generateCoast } from "./generateCoast";
import type RenderParams from './renderParams';

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
