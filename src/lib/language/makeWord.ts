function makeWord(lang: Language, key: string) {
  const nsylls = randRange(lang.minimumNumOfSyllables, lang.maxNumOfSyllables + 1);
  let w = '';
  const keys = [];
  keys[randRange(nsylls)] = key;
  for (let i = 0; i < nsylls; i++) {
    w += getMorpheme(lang, keys[i]);
  }
  return w;
}
