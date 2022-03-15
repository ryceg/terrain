'use strict';

import VowelSet from './vowelSet';

export function all(): VowelSet[] {
  return [
    new VowelSet('3-vowel a i u', 'aiu'),
    new VowelSet('3-vowel e o u', 'eou'),
    new VowelSet('5-vowel a i u A I', 'aiuAI'),
    new VowelSet('Extra A E I', 'aeiouAEI'),
    new VowelSet('Extra A O U', 'aeiouAOU'),
    new VowelSet('Extra U', 'aeiouU'),
    new VowelSet('Standard 5-vowel', 'aeiou'),
  ];
}
