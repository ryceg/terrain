"use strict";

import * as contour from "./contour";
import * as Draw from "./draw";
import { drawLabels } from "./drawLabels";
import * as getBorders from "./getBorders";
import * as getRivers from "./getRivers";
import * as getTerritories from "./getTerritories";
import type { RenderData } from './renderData';
import * as Visualize from "./visualize";

export function drawMap(svg, render: RenderData) {
  render.rivers = getRivers.getRivers(render.h, 0.01);
  render.coasts = contour.contour(render.h, 0);
  render.terr = getTerritories.getTerritories(render);
  render.borders = getBorders.getBorders(render);

  Draw.drawPaths(svg, 'river', render.rivers);
  Draw.drawPaths(svg, 'coast', render.coasts);
  Draw.drawPaths(svg, 'border', render.borders);

  Visualize.visualizeSlopes(svg, render);
  Visualize.visualizeCities(svg, render);
  drawLabels(svg, render);
}
