'use strict';
import type { Selection } from 'd3';


export function addSVG(div: Selection<SVGSVGElement, any, any, any>) {
  return div.insert("svg", ":first-child")
    .attr("height", 400)
    .attr("width", 400)
    .attr("viewBox", "-500 -500 1000 1000");
}
