'use strict';

import Orthography from './orthography';

export function all(): Orthography[] {
  return [
    new Orthography('Ácutes', {}),
    new Orthography('Ümlauts', {
      A: 'ä',
      E: 'ë',
      I: 'ï',
      O: 'ö',
      U: 'ü'
    }
    ),
    new Orthography('Welsh', {
      A: 'â',
      E: 'ê',
      I: 'y',
      O: 'ô',
      U: 'w'
    }
    ),
    new Orthography('Diphthongs', {
      A: 'au',
      E: 'ei',
      I: 'ie',
      O: 'ou',
      U: 'oo'
    }
    ),
    new Orthography('Doubles', {
      A: 'aa',
      E: 'ee',
      I: 'ii',
      O: 'oo',
      U: 'uu'
    }
    ),
  ];
}
