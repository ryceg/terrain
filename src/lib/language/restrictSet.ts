'use strict';

import { Set } from './set';

export default class RestrictSet extends Set {
  res: RegExp[];

  constructor(name: string, res: RegExp[]) {
    super(name);
    this.res = res;
  }
}
