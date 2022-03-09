function makeSyllable(lang: Language) {
  while (true) {
    let syll = '';
    for (let i = 0; i < lang.structure.length; i++) {
      const phonemeType = lang.structure[i];
      if (lang.structure[i + 1] === '?') {
        i++;
        if (Math.random() < 0.5) {
          continue;
        }
      }
      syll += choose(lang.phonemes[phonemeType], lang.exponent);
    }
    let bad = false;
    for (let i = 0; i < lang.restricts.length; i++) {
      if (lang.restricts[i].test(syll)) {
        bad = true;
        break;
      }
    }
    if (bad)
      continue;
    return spell(lang, syll);
  }
}
