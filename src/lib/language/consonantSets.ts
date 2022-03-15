'use strict';

import ConsonantSet from './consonantSet';

export function all(): ConsonantSet[] {
  return [
    new ConsonantSet('Arabic-ish', 'tksʃdbqɣxmnlrwj'),
    new ConsonantSet('Arabic-lite', 'tkdgmnsʃ'),
    new ConsonantSet('English-ish', 'ptkbdgmnlrsʃzʒʧ'),
    new ConsonantSet('English-lite', 'ptkbdgmnszʒʧhjw'),
    new ConsonantSet('Greenlandic-ish', 'ptkqvsgrmnŋlj'),
    new ConsonantSet('Hawaiian-ish', 'hklmnpwʔ'),
    new ConsonantSet('Minimal', 'ptkmnls'),
    new ConsonantSet('Pirahã (very simple)', 'ptkmnh'),
  ];
}
