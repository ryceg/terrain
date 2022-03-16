'use strict';

export default class RestrictSet {
  name: string;
  res: RegExp[];

  constructor(name: string, res: RegExp[]) {
    this.name = name;
    this.res = res;
  }
}
