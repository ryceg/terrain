"use strict";
import { defaultParams } from "./defaultParams";
import { drawMap } from "./drawMap";
import type RenderData from './renderData';
import { placeCities } from './terrain';

export function doMap(svg, params = defaultParams) {
  const render: RenderData = {
    params,
    h: params.generator(params),
  };
  placeCities(render);
  drawMap(svg, render);
}
