function getMorpheme(lang: Language, key = '') {
  if (lang.noMorph) {
    return makeSyllable(lang);
  }
  const list = lang.morphemes[key] || [];
  let extras = 10;
  if (key)
    extras = 1;
  while (true) {
    const n = randRange(list.length + extras);
    if (list[n])
      return list[n];
    const morph = makeSyllable(lang);
    let bad = false;
    for (const k in lang.morphemes) {
      if (lang.morphemes[k].includes(morph)) {
        bad = true;
        break;
      }
    }
    if (bad)
      continue;
    list.push(morph);
    lang.morphemes[key] = list;
    return morph;
  }
}
