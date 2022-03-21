'use strict';

import PhonemeSet from './phonemeSet';

export default class Language {
  phonemes: PhonemeSet = new PhonemeSet();
  genitive: string;
  definite: string;
  structure = 'CVC';
  exponent = 2;
  restricts: RegExp[] = [];
  cortho: object = {};
  vortho: object = {};
  noOrtho = true
  noMorph = true
  noWordPool = true
  minimumNumOfSyllables = 1;
  maxNumOfSyllables = 1;
  morphemes: object = {};
  words: object = {};
  names: string[] = [];
  joiner = ' '
  maxCharacters = 12;
  minCharacters = 5;

  constructor(base: Partial<Language> = {}) {
    Object.assign(this, base);
  }
}
