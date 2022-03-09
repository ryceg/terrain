function spell(lang: Language, syll) {
  if (lang.noOrtho)
    return syll;
  let s = '';
  for (let i = 0; i < syll.length; i++) {
    const c = syll[i];
    s += lang.cortho[c] || lang.vortho[c] || defaultOrtho[c] || c;
  }
  return s;
}
