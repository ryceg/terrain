'use strict';

import SibilantSet from './sibilantSet';

export function all(): SibilantSet[] {
  return [
    new SibilantSet('Just s', 's'),
    new SibilantSet('s ʃ', 'sʃ'),
    new SibilantSet('s ʃ f', 'sʃf'),
  ];
}
