"use strict";

import type { City } from './city';
import type { HInterface } from './hinterface';
import Label from './label';
import * as Languages from "./language/languages";
import type { Border, Coast, RenderData, River } from "./renderData";
import { terrCenter } from "./terrCenter";

function penalty(label: Label, labels: Label[], h: HInterface, cities: City[], avoids: [River, Coast, Border]): number {
  let pen = 0;
  if (label.x0 < -0.45 * h.mesh.extent.width)
    pen += 100;
  if (label.x1 > 0.45 * h.mesh.extent.width)
    pen += 100;
  if (label.y0 < -0.45 * h.mesh.extent.height)
    pen += 100;
  if (label.y1 > 0.45 * h.mesh.extent.height)
    pen += 100;
  for (let i = 0; i < labels.length; i++) {
    const olabel = labels[i];
    if (label.x0 < olabel.x1 && label.x1 > olabel.x0 &&
      label.y0 < olabel.y1 && label.y1 > olabel.y0) {
      pen += 100;
    }
  }

  for (let i = 0; i < cities.length; i++) {
    const c = h.mesh.vxs[cities[i]];
    if (label.x0 < c[0] && label.x1 > c[0] && label.y0 < c[1] && label.y1 > c[1]) {
      pen += 100;
    }
  }

  for (let i = 0; i < avoids.length; i++) {
    const avoid = avoids[i];
    for (let j = 0; j < avoid.length; j++) {
      const avpath = avoid[j];
      for (let k = 0; k < avpath.length; k++) {
        const pt = avpath[k];
        if (pt[0] > label.x0 && pt[0] < label.x1 && pt[1] > label.y0 && pt[1] < label.y1) {
          pen++;
        }
      }
    }
  }
  return pen;
}

export function drawLabels(svg, render: RenderData) {
  const params = render.params;
  const h = render.h;
  const terr = render.terr;
  const cities = render.cities;
  const nterrs = render.params.nterrs;
  const avoids: [River, Coast, Border] = [render.rivers, render.coasts, render.borders];
  const lang = Languages.makeRandomLanguage();
  const cityLabels = [];

  for (let i = 0; i < cities.length; i++) {
    const x = h.mesh.vxs[cities[i]][0];
    const y = h.mesh.vxs[cities[i]][1];
    const text = Languages.makeName(lang, 'city');
    const size = i < nterrs ? params.fontSizes.city : params.fontSizes.town;
    const sx = 0.65 * size / 1000 * text.length;
    const sy = size / 1000;
    const possLabels = [
      new Label(
        x + 0.8 * sy,
        y + 0.3 * sy,
        x + 0.7 * sy,
        y - 0.6 * sy,
        x + 0.7 * sy + sx,
        y + 0.6 * sy,
        'start'
      ),
      new Label(
        x - 0.8 * sy,
        y + 0.3 * sy,
        x - 0.9 * sy - sx,
        y - 0.7 * sy,
        x - 0.9 * sy,
        y + 0.7 * sy,
        'end'
      ),
      new Label(
        x,
        y - 0.8 * sy,
        x - sx / 2,
        y - 1.9 * sy,
        x + sx / 2,
        y - 0.7 * sy,
        'middle'
      ),
      new Label(
        x,
        y + 1.2 * sy,
        x - sx / 2,
        y + 0.1 * sy,
        x + sx / 2,
        y + 1.3 * sy,
        'middle'
      ),
    ];

    const label = possLabels.reduce((a, b) => (penalty(a, possLabels, h, cities, avoids) > penalty(b, possLabels, h, cities, avoids) ? b : a));
    label.text = text;
    label.size = size;
    cityLabels.push(label);
  }
  let texts = svg.selectAll('text.city').data(cityLabels);
  texts.enter()
    .append('text')
    .classed('city', true);
  texts.exit()
    .remove();
  svg.selectAll('text.city')
    .attr('x', (d) => 1000 * d.x)
    .attr('y', (d) => 1000 * d.y)
    .style('font-size', (d) => d.size)
    .style('text-anchor', (d) => d.align)
    .text((d) => d.text)
    .raise();

  const reglabels = [];
  for (let i = 0; i < nterrs; i++) {
    const city = cities[i];
    const text = Languages.makeName(lang, 'region');
    const sy = params.fontSizes.region / 1000;
    const sx = 0.6 * text.length * sy;
    const lc = terrCenter(h, terr, city, true);
    const oc = terrCenter(h, terr, city, false);
    let best = 0;
    let bestScore = -999999;
    for (let j = 0; j < h.length; j++) {
      let score = 0;
      const v = h.mesh.vxs[j];
      score -= 3000 * Math.sqrt((v[0] - lc[0]) * (v[0] - lc[0]) + (v[1] - lc[1]) * (v[1] - lc[1]));
      score -= 1000 * Math.sqrt((v[0] - oc[0]) * (v[0] - oc[0]) + (v[1] - oc[1]) * (v[1] - oc[1]));
      if (terr[j] !== city)
        score -= 3000;
      for (let k = 0; k < cities.length; k++) {
        const u = h.mesh.vxs[cities[k]];
        if (Math.abs(v[0] - u[0]) < sx &&
          Math.abs(v[1] - sy / 2 - u[1]) < sy) {
          score -= k < nterrs ? 4000 : 500;
        }
        if (v[0] - sx / 2 < cityLabels[k].x1 &&
          v[0] + sx / 2 > cityLabels[k].x0 &&
          v[1] - sy < cityLabels[k].y1 &&
          v[1] > cityLabels[k].y0) {
          score -= 5000;
        }
      }
      for (let k = 0; k < reglabels.length; k++) {
        const label = reglabels[k];
        if (v[0] - sx / 2 < label.x + label.width / 2 &&
          v[0] + sx / 2 > label.x - label.width / 2 &&
          v[1] - sy < label.y &&
          v[1] > label.y - label.size) {
          score -= 20000;
        }
      }
      if (h[j] <= 0)
        score -= 500;
      if (v[0] + sx / 2 > 0.5 * h.mesh.extent.width)
        score -= 50000;
      if (v[0] - sx / 2 < -0.5 * h.mesh.extent.width)
        score -= 50000;
      if (v[1] > 0.5 * h.mesh.extent.height)
        score -= 50000;
      if (v[1] - sy < -0.5 * h.mesh.extent.height)
        score -= 50000;
      if (score > bestScore) {
        bestScore = score;
        best = j;
      }
    }
    reglabels.push({
      text: text,
      x: h.mesh.vxs[best][0],
      y: h.mesh.vxs[best][1],
      size: sy,
      width: sx
    });
  }
  texts = svg.selectAll('text.region').data(reglabels);
  texts.enter()
    .append('text')
    .classed('region', true);
  texts.exit()
    .remove();
  svg.selectAll('text.region')
    .attr('x', function (d) { return 1000 * d.x; })
    .attr('y', function (d) { return 1000 * d.y; })
    .style('font-size', function (d) { return 1000 * d.size; })
    .style('text-anchor', 'middle')
    .text(function (d) { return d.text; })
    .raise();

}
