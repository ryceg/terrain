'use strict';

import random from 'random';

export function shuffled(list: any[]): any {
  const newlist = [];
  for (let i = 0; i < list.length; i++) {
    newlist.push(list[i]);
  }
  for (let i = list.length - 1; i > 0; i--) {
    const tmp = newlist[i];
    const j = randRange(i);
    newlist[i] = newlist[j];
    newlist[j] = tmp;
  }
  return newlist;
}

export function choose(list: any[], exponent: number = 1): any {
  return list[Math.floor(Math.pow(random.float(0, 1), exponent) * list.length)];
}

export function randomString(length: number): string {
  let result: string = '';

  for (let i = 0; i < length; i++) {
    result += random.float(0, 1).toString(36).slice(2)[0];
  }

  return result;
}

export function randRange(lo: number, hi?: number) {
  if (hi === undefined) {
    hi = lo;
    lo = 0;
  }
  return Math.floor(random.float(0, 1) * (hi - lo)) + lo;
}
