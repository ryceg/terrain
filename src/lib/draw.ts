'use strict';

import * as d3 from 'd3';

export function makeD3Path(path) {
  const p = d3.path();
  p.moveTo(1000 * path[0][0], 1000 * path[0][1]);
  for (let i = 1; i < path.length; i++) {
    p.lineTo(1000 * path[i][0], 1000 * path[i][1]);
  }
  return p.toString();
}

export function drawPaths(svg, cls: string, paths) {
  paths = svg.selectAll('path.' + cls).data(paths)
  paths.enter()
    .append('path')
    .classed(cls, true)
  paths.exit()
    .remove();
  svg.selectAll('path.' + cls)
    .attr('d', makeD3Path);
}
