'use strict';
import { placeCity } from './placeCity';
import type { RenderData } from './renderData';


export function placeCities(render: RenderData) {
  const params = render.params;
  const n = params.ncities;
  for (let i = 0; i < n; i++) {
    placeCity(render);
  }
}
