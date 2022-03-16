'use strict';

export function join(list: string[], sep = ''): string {
  if (list.length === 0) return '';
  let s = list[0];
  for (let i = 1; i < list.length; i++) {
    s += sep;
    s += list[i];
  }
  return s;
}

export function capitalize(word: string): string {
  return word[0].toUpperCase() + word.slice(1);
}
