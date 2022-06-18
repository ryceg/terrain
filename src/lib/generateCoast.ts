'use strict';
import { add } from './add';
import { cleanCoast } from './cleanCoast';
import { doErosion } from './doErosion';
import { fillSinks } from './fillSinks';
import { generateGoodMesh } from './generateGoodMesh';
import * as Geometry from "./geometry";
import type { HInterface } from './hinterface';
import { mountains } from './mountains';
import { peaky } from './peaky';
import { relax } from './relax';
import type RenderParams from './renderParams';
import { setSeaLevel } from './setSeaLevel';


export function generateCoast(params: RenderParams): HInterface {
  const mesh = generateGoodMesh(params.npts, params.extent);
  let h = add(
    Geometry.slope(mesh, Geometry.randomVector(4)),
    Geometry.cone(mesh, Geometry.runif(-1, -1)),
    mountains(mesh, 50)
  );
  for (let i = 0; i < 10; i++) {
    h = relax(h);
  }
  h = peaky(h);
  h = doErosion(h, Geometry.runif(0, 0.1), 5);
  h = setSeaLevel(h, Geometry.runif(0.2, 0.6));
  h = fillSinks(h);
  h = cleanCoast(h);
  return h;
}
