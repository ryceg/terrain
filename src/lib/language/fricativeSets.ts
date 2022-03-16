'use strict';

import FricativeSet from './fricativeSet';

export function all(): FricativeSet[] {
  return [
    new FricativeSet('m n', 'mn'),
    new FricativeSet('s k', 'sk'),
    new FricativeSet('m n ŋ', 'mnŋ'),
    new FricativeSet('s ʃ z ʒ', 'sʃzʒ'),
  ];
}
