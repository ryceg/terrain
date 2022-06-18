'use strict';

import type { City } from './city';
import type { HInterface } from './hinterface';
import type RenderParams from './renderParams';

export type River = number[][]
export type Coast = number[][]
export type Border = number[][]
export interface RenderData {
  cities?: City[]
  rivers?: River
  coasts?: Coast
  borders?: Border
  terr?: any
  params: RenderParams

  h: HInterface
}
