const corthsets: {
  name: string;
  orth: Record<string, string>;
}[] = [
    {
      name: 'Default',
      orth: {}
    },
    {
      name: 'Slavic',
      orth: {
        ʃ: 'š',
        ʒ: 'ž',
        ʧ: 'č',
        ʤ: 'ǧ',
        j: 'j'
      }
    },
    {
      name: 'German',
      orth: {
        ʃ: 'sch',
        ʒ: 'zh',
        ʧ: 'tsch',
        ʤ: 'dz',
        j: 'j',
        x: 'ch'
      }
    },
    {
      name: 'French',
      orth: {
        ʃ: 'ch',
        ʒ: 'j',
        ʧ: 'tch',
        ʤ: 'dj',
        x: 'kh'
      }
    },
    {
      name: 'Chinese (pinyin)',
      orth: {
        ʃ: 'x',
        ʧ: 'q',
        ʤ: 'j'
      }
    }
  ];
