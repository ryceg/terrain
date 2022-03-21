'use strict';

import { Set } from './set';

export default class LiquidSet extends Set {
  L: string;

  constructor(name: string, L: string) {
    super(name);
    this.L = L;
  }
}
