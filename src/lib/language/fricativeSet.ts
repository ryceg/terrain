'use strict';

import { Set } from './set';

export default class FricativeSet extends Set {
  F: string;
  constructor(name: string, F: string) {
    super(name);
    this.F = F;
  }
}
