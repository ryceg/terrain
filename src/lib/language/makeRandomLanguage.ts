function makeRandomLanguage() {
  const lang = makeBasicLanguage();
  lang.noOrtho = false;
  lang.noMorph = false;
  lang.noWordPool = false;
  lang.phonemes.C = shuffled(choose(consonantSets, 2).C);
  lang.phonemes.V = shuffled(choose(vowelSets, 2).V);
  lang.phonemes.L = shuffled(choose(lSets, 2).L);
  lang.phonemes.S = shuffled(choose(sSets, 2).S);
  lang.phonemes.F = shuffled(choose(fSets, 2).F);
  lang.structure = choose(syllableStructures);
  lang.restricts = restrictSets[2].res;
  lang.cortho = choose(corthsets, 2).orth;
  lang.vortho = choose(vorthsets, 2).orth;
  lang.minimumNumOfSyllables = randRange(1, 3);
  if (lang.structure.length < 3)
    lang.minimumNumOfSyllables++;
  lang.maxNumOfSyllables = randRange(lang.minimumNumOfSyllables + 1, 7);
  lang.joiner = choose('   -');
  return lang;
}
