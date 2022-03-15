'use strict';

import PhonemeSet from './phonemeSet';

export default class Language {
  phonemes: PhonemeSet;
  genitive: string;
  definite: string;
  structure: string;
  exponent: number;
  restricts: RegExp[];
  cortho: object;
  vortho: object;
  noOrtho: boolean;
  noMorph: boolean;
  noWordPool: boolean;
  minimumNumOfSyllables: number;
  maxNumOfSyllables: number;
  morphemes: object;
  words: object;
  names: string[];
  joiner: string;
  maxCharacters: number;
  minCharacters: number;

  constructor() {
    this.phonemes = new PhonemeSet();
    this.joiner = ' ';
    this.minimumNumOfSyllables = 1;
    this.maxNumOfSyllables = 1;
    this.cortho = {};
    this.vortho = {};
    this.noOrtho = true;
    this.noMorph = true;
    this.noWordPool = true;
    this.restricts = [];
    this.morphemes = {};
    this.words = {};
    this.names = [];
    this.exponent = 2;
    this.structure = 'CVC';
    this.maxCharacters = 12;
    this.minCharacters = 5;
  }
}
