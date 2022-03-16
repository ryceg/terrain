'use strict';

export default class Orthography {
  name: string;
  orth: object;

  constructor(name: string, orth: object) {
    this.name = name;
    this.orth = orth;
  }
}
