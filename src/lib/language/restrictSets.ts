'use strict';

import RestrictSet from './restrictSet';

export function all(): RestrictSet[] {
  return [
    new RestrictSet('None', []),
    new RestrictSet('Double sounds', [/(.)\1/]),
    new RestrictSet('Doubles and hard clusters', [/[sʃf][sʃ]/, /(.)\1/, /[rl][rl]/]),
  ];
}
