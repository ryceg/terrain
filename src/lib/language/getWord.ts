function getWord(lang: Language, key = '') {
  const ws = lang.words[key] || [];
  let extras = 3;
  if (key)
    extras = 2;
  while (true) {
    const n = randRange(ws.length + extras);
    let w = ws[n];
    if (w) {
      return w;
    }
    w = makeWord(lang, key);
    let bad = false;
    for (const k in lang.words) {
      if (lang.words[k].includes(w)) {
        bad = true;
        break;
      }
    }
    if (bad)
      continue;
    ws.push(w);
    lang.words[key] = ws;
    return w;
  }
}
