'use strict';

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

export function choose(list: any[], exponent = 1): any {
  return list[Math.floor(Math.pow(Math.random(), exponent) * list.length)];
}

export function randRange(lo: number, hi?: number) {
  if (hi === undefined) {
    hi = lo;
    lo = 0;
  }
  return Math.floor(Math.random() * (hi - lo)) + lo;
}
