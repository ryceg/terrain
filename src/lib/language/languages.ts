'use strict';

import * as RND from "../random";
import * as ConsonantOrthographies from "./consonantOrthographies";
import * as ConsonantSets from "./consonantSets";
import * as FricativeSets from "./fricativeSets";
import Language from './language';
import * as LiquidSets from "./liquidSets";
import * as Morphemes from "./morphemes";
import * as RestrictSets from "./restrictSets";
import * as SibilantSets from "./sibilantSets";
import * as Syllables from "./syllables";
import * as Transformation from "./transformation";
import * as VowelOrthographies from "./vowelOrthographies";
import * as VowelSets from "./vowelSets";
import * as Words from "./words";

export const consonantSets = ConsonantSets.all();

export function makeBasicLanguage(): Language {
  return new Language();
}

export function makeOrthoLanguage(): Language {
  const lang = new Language();
  lang.noOrtho = false;
  return lang;
}

export function makeRandomLanguage(): Language {
  const lang = new Language();
  const restrictSets = RestrictSets.all();
  const lSets = LiquidSets.all();
  const sSets = SibilantSets.all();
  const fSets = FricativeSets.all();
  const vowelSets = VowelSets.all();
  const corthsets = ConsonantOrthographies.all();
  const vorthsets = VowelOrthographies.all();
  lang.noOrtho = false;
  lang.noMorph = false;
  lang.noWordPool = false;
  lang.phonemes.C = RND.shuffled(RND.choose(consonantSets, 2).C);
  lang.phonemes.V = RND.shuffled(RND.choose(vowelSets, 2).V);
  lang.phonemes.L = RND.shuffled(RND.choose(lSets, 2).L);
  lang.phonemes.S = RND.shuffled(RND.choose(sSets, 2).S);
  lang.phonemes.F = RND.shuffled(RND.choose(fSets, 2).F);
  lang.structure = RND.choose(Syllables.getStructures());
  lang.restricts = restrictSets[2].res;
  lang.cortho = RND.choose(corthsets, 2).orth;
  lang.vortho = RND.choose(vorthsets, 2).orth;
  lang.minimumNumOfSyllables = RND.randRange(1, 3);
  if (lang.structure.length < 3)
    lang.minimumNumOfSyllables++;
  lang.maxNumOfSyllables = RND.randRange(lang.minimumNumOfSyllables + 1, 7);
  lang.joiner = RND.choose(['', '', '', '', '-']);
  return lang;
}

export function makeName(lang: Language, key = '') {
  lang.genitive = lang.genitive || Morphemes.getMorpheme(lang, 'of');
  lang.definite = lang.definite || Morphemes.getMorpheme(lang, 'the');
  while (true) {
    let name = null;
    if (Math.random() < 0.5) {
      name = Transformation.capitalize(Words.getWord(lang, key));
    } else {
      const w1 = Transformation.capitalize(Words.getWord(lang, Math.random() < 0.6 ? key : ''));
      const w2 = Transformation.capitalize(Words.getWord(lang, Math.random() < 0.6 ? key : ''));
      if (w1 === w2)
        continue;
      if (Math.random() > 0.5) {
        name = Transformation.join([w1, w2], lang.joiner);
      } else {
        name = Transformation.join([w1, lang.genitive, w2], lang.joiner);
      }
    }
    if (Math.random() < 0.1) {
      name = Transformation.join([lang.definite, name], lang.joiner);
    }

    if (name.length < lang.minCharacters || name.length > lang.maxCharacters)
      continue;
    let used = false;
    for (let i = 0; i < lang.names.length; i++) {
      const name2 = lang.names[i];
      if (name.indexOf(name2) != -1 || name2.indexOf(name) != -1) {
        used = true;
        break;
      }
    }
    if (used)
      continue;
    lang.names.push(name);
    return name;
  }
}
