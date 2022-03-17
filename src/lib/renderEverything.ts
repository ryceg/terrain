'use strict';

import * as d3 from 'd3';
import { defaultParams } from './defaultParams';
import { doMap } from "./doMap";

export function render() {
  var myMap = d3.select("div#container");
  var svg = addSVG(myMap);

  myMap.append("button")
    .text("Generate map")
    .on("click", function () {
      doMap(svg, defaultParams);
    });
}

function addSVG(div) {
  return div.insert("svg", ":first-child")
    .attr("height", 400)
    .attr("width", 400)
    .attr("viewBox", "-500 -500 1000 1000");
}

