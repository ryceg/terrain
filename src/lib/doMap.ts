"use strict";
import { defaultParams } from "./defaultParams";
import { drawMap } from "./drawMap";
import { placeCities, type Render } from './terrain';


export function doMap(svg: SVGSVGElement, params = defaultParams) {
  const render: Render = {
    params,
    h: params.generator(params),
  };
  // const width = svg.attr('width');
  // svg.attr('height', width * params.extent.height / params.extent.width);
  // svg.attr('viewBox', -1000 * params.extent.width / 2 + ' ' +
  //   -1000 * params.extent.height / 2 + ' ' +
  //   1000 * params.extent.width + ' ' +
  //   1000 * params.extent.height);
  // d3.selectAll().remove();
  placeCities(render);
  drawMap(svg, render);
}
