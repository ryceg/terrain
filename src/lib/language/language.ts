export interface Language {
	phonemes: {
		C: 'ptkmnls'
		V: 'aeiou'
		S: 's'
		F: 'mn'
		L: 'rl'
	}
	structure: string
	exponent: number
	restricts: RegExp[]
	cortho: {

	}
	vortho: {

	}
	noOrtho: boolean
	noMorph: boolean
	noWordPool: boolean
	minimumNumOfSyllables: number
	maxNumOfSyllables: number
	morphemes: {

	}
	words: {

	}
	names: string[]
	joiner: ' '
	maxCharacters: 12
	minCharacters: 5
}

export const basicLanguage: Language = {
	phonemes: {
		C: 'ptkmnls',
		V: 'aeiou',
		S: 's',
		F: 'mn',
		L: 'rl'
	},
	structure: 'CVC',
	exponent: 2,
	restricts: [],
	cortho: {},
	vortho: {},
	noOrtho: true,
	noMorph: true,
	noWordPool: true,
	minimumNumOfSyllables: 1,
	maxNumOfSyllables: 1,
	morphemes: {},
	words: {},
	names: [],
	joiner: ' ',
	maxCharacters: 12,
	minCharacters: 5
};

export function shuffled(list) {
	const newlist = [];
	for (let i = 0; i < list.length; i++) {
		newlist.push(list[i]);
	}
	for (let i = list.length - 1; i > 0; i--) {
		const tmp = newlist[i];
		const j = randRange(i);
		newlist[i] = newlist[j];
		newlist[j] = tmp;
	}
	return newlist;
}

export function choose(list: any[], exponent = 1): any {
	return list[Math.floor(Math.pow(Math.random(), exponent) * list.length)];
}

export function randRange(lo: number, hi?: number) {
	if (hi === undefined) {
		hi = lo;
		lo = 0;
	}
	return Math.floor(Math.random() * (hi - lo)) + lo;
}

export function join(list: string[], sep = ''): string {
	if (list.length === 0) return '';
	let s = list[0];
	for (let i = 1; i < list.length; i++) {
		s += sep;
		s += list[i];
	}
	return s;
}

export function capitalize(word: string): string {
	return word[0].toUpperCase() + word.slice(1);
}


