'use strict';

import * as RND from "../random";
import type Language from './language';
import * as Syllables from "./syllables";

export function getMorpheme(lang: Language, key = ''): string {
  if (lang.noMorph) {
    return Syllables.makeSyllable(lang);
  }
  const list = lang.morphemes[key] || [];
  let extras = 10;
  if (key)
    extras = 1;
  while (true) {
    const n = RND.randRange(list.length + extras);
    if (list[n])
      return list[n];
    const morph = Syllables.makeSyllable(lang);
    let bad = false;
    for (const k in lang.morphemes) {
      if (lang.morphemes[k].includes(morph)) {
        bad = true;
        break;
      }
    }
    if (bad)
      continue;
    list.push(morph);
    lang.morphemes[key] = list;
    return morph;
  }
}
