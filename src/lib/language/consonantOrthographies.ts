'use strict';

import Orthography from './orthography';

export function all(): Orthography[] {
  return [
    new Orthography('Default', {}),
    new Orthography('Slavic', {
      ʃ: 'š',
      ʒ: 'ž',
      ʧ: 'č',
      ʤ: 'ǧ',
      j: 'j'
    }
    ),
    new Orthography('German', {
      ʃ: 'sch',
      ʒ: 'zh',
      ʧ: 'tsch',
      ʤ: 'dz',
      j: 'j',
      x: 'ch'
    }
    ),
    new Orthography('French', {
      ʃ: 'ch',
      ʒ: 'j',
      ʧ: 'tch',
      ʤ: 'dj',
      x: 'kh'
    }
    ),
    new Orthography('Chinese (pinyin)', {
      ʃ: 'x',
      ʧ: 'q',
      ʤ: 'j'
    }
    ),
  ];
}
