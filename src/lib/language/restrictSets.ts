const restrictSets: {
  name: string;
  res: RegExp[];
}[] = [
    {
      name: 'None',
      res: []
    },
    {
      name: 'Double sounds',
      res: [/(.)\1/]
    },
    {
      name: 'Doubles and hard clusters',
      res: [/[sʃf][sʃ]/, /(.)\1/, /[rl][rl]/]
    }
  ];
