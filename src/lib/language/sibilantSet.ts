'use strict';

import { Set } from './set';

export default class SibilantSet extends Set {
  S: string;

  constructor(name: string, S: string) {
    super(name);
    this.S = S;
  }
}
