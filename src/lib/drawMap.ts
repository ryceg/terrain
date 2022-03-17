"use strict";

import { drawLabels } from "./drawLabels";
import type Render from './render';
import { contour, drawPaths, getBorders, getRivers, getTerritories, visualizeCities, visualizeSlopes } from './terrain';

export function drawMap(svg, render: Render) {
  render.rivers = getRivers(render.h, 0.01);
  render.coasts = contour(render.h, 0);
  render.terr = getTerritories(render);
  render.borders = getBorders(render);
  drawPaths(svg, 'river', render.rivers);
  drawPaths(svg, 'coast', render.coasts);
  drawPaths(svg, 'border', render.borders);
  visualizeSlopes(svg, render);
  visualizeCities(svg, render);
  drawLabels(svg, render);
}
