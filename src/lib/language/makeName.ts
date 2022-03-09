function makeName(lang: Language, key = '') {
  lang.genitive = lang.genitive || getMorpheme(lang, 'of');
  lang.definite = lang.definite || getMorpheme(lang, 'the');
  while (true) {
    let name = null;
    if (Math.random() < 0.5) {
      name = capitalize(getWord(lang, key));
    } else {
      const w1 = capitalize(getWord(lang, Math.random() < 0.6 ? key : ''));
      const w2 = capitalize(getWord(lang, Math.random() < 0.6 ? key : ''));
      if (w1 === w2)
        continue;
      if (Math.random() > 0.5) {
        name = join([w1, w2], lang.joiner);
      } else {
        name = join([w1, lang.genitive, w2], lang.joiner);
      }
    }
    if (Math.random() < 0.1) {
      name = join([lang.definite, name], lang.joiner);
    }

    if (name.length < lang.minCharacters || name.length > lang.maxCharacters)
      continue;
    let used = false;
    for (let i = 0; i < lang.names.length; i++) {
      const name2 = lang.names[i];
      if (name.indexOf(name2) != -1 || name2.indexOf(name) != -1) {
        used = true;
        break;
      }
    }
    if (used)
      continue;
    lang.names.push(name);
    return name;
  }
}
