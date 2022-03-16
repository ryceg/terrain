'use strict';

import LiquidSet from './liquidSet';

export function all(): LiquidSet[] {
  const rl = new LiquidSet('r l', 'rl');
  const justR = new LiquidSet('Just r', 'r');
  const justL = new LiquidSet('Just l', 'l');
  const wj = new LiquidSet('w j', 'wj');
  const rlwj = new LiquidSet('r l w j', 'rlwj');

  return [
    rl,
    justR,
    justL,
    wj,
    rlwj,
  ];
}
