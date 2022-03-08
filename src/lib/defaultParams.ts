"use strict";
import { defaultExtent, generateCoast } from './terrain';


export const defaultParams = {
  extent: defaultExtent,
  generator: generateCoast,
  npts: 16384,
  ncities: 15,
  nterrs: 5,
  fontsizes: {
    region: 40,
    city: 25,
    town: 20
  }
};
