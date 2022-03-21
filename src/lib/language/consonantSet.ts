'use strict';

import { Set } from './set';

export default class ConsonantSet extends Set {
  C: string;
  constructor(name: string, C: string) {
    super(name);
    this.C = C;
  }
}
