'use strict';

import { Set } from './set';

export default class Orthography extends Set {
  orth: object;

  constructor(name: string, orth: object) {
    super(name);
    this.orth = orth;
  }
}
