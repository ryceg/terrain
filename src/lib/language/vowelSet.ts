'use strict';

import { Set } from './set';

export default class VowelSet extends Set {
  V: string;

  constructor(name: string, V: string) {
    super(name);
    this.V = V;
  }
}
