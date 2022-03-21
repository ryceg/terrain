"use strict";

import * as Draw from "./draw";
import { drawLabels } from "./drawLabels";
import type RenderData from './renderData';
import * as Terrain from './terrain';
import * as Visualize from "./visualize";

export function drawMap(svg, render: RenderData) {
  render.rivers = Terrain.getRivers(render.h, 0.01);
  render.coasts = Terrain.contour(render.h, 0);
  render.terr = Terrain.getTerritories(render);
  render.borders = Terrain.getBorders(render);

  Draw.drawPaths(svg, 'river', render.rivers);
  Draw.drawPaths(svg, 'coast', render.coasts);
  Draw.drawPaths(svg, 'border', render.borders);

  Visualize.visualizeSlopes(svg, render);
  Visualize.visualizeCities(svg, render);
  drawLabels(svg, render);
}
