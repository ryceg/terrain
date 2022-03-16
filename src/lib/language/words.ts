'use strict';

import * as RND from "../random";
import type Language from './language';
import * as Morphemes from "./morphemes";
import * as Orthographies from "./orthographies";

export function getWord(lang: Language, key = ''): string {
  const ws = lang.words[key] || [];
  let extras = 3;
  if (key)
    extras = 2;
  while (true) {
    const n = RND.randRange(ws.length + extras);
    let w = ws[n];
    if (w) {
      return w;
    }
    w = makeWord(lang, key);
    let bad = false;
    for (const k in lang.words) {
      if (lang.words[k].includes(w)) {
        bad = true;
        break;
      }
    }
    if (bad)
      continue;
    ws.push(w);
    lang.words[key] = ws;
    return w;
  }
}

export function makeWord(lang: Language, key: string): string {
  const nsylls = RND.randRange(lang.minimumNumOfSyllables, lang.maxNumOfSyllables + 1);
  let w = '';
  const keys = [];
  keys[RND.randRange(nsylls)] = key;
  for (let i = 0; i < nsylls; i++) {
    w += Morphemes.getMorpheme(lang, keys[i]);
  }
  return w;
}

export function spell(lang: Language, syll: string): string {
  const defaultOrtho = Orthographies.defaultOrthography();

  if (lang.noOrtho)
    return syll;
  let s = '';
  for (let i = 0; i < syll.length; i++) {
    const c = syll[i];
    s += lang.cortho[c] || lang.vortho[c] || defaultOrtho[c] || c;
  }
  return s;
}
