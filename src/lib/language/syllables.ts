'use strict';

import * as RND from "../random";
import type Language from './language';
import * as Words from "./words";

export function getStructures(): string[] {
  return [
    'CVC',
    'CVV?C',
    'CVVC?',
    'CVC?',
    'CV',
    'VC',
    'CVF',
    'C?VC',
    'CVF?',
    'CL?VC',
    'CL?VF',
    'S?CVC',
    'S?CVF',
    'S?CVC?',
    'C?VF',
    'C?VC?',
    'C?VF?',
    'C?L?VC',
    'VC',
    'CVL?C?',
    'C?VL?C',
    'C?VLC?',
  ];
}

export function makeSyllable(lang: Language): string {
  while (true) {
    let syll = '';
    for (let i = 0; i < lang.structure.length; i++) {
      const phonemeType = lang.structure[i];
      if (lang.structure[i + 1] === '?') {
        i++;
        if (Math.random() < 0.5) {
          continue;
        }
      }
      syll += RND.choose(lang.phonemes[phonemeType], lang.exponent);
    }
    let bad = false;
    for (let i = 0; i < lang.restricts.length; i++) {
      if (lang.restricts[i].test(syll)) {
        bad = true;
        break;
      }
    }
    if (bad)
      continue;
    return Words.spell(lang, syll);
  }
}
