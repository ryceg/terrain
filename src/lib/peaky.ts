'use strict';
import type { HInterface } from './hinterface';
import { map } from './map';
import { normalize } from './normalize';

export function peaky(h: HInterface) {
  return map(normalize(h), Math.sqrt);
}
