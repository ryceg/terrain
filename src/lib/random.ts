'use strict';

export function shuffled(list: string): string;
export function shuffled<T>(list: T[]): T[];
export function shuffled<T>(list: T[] | string): T[] | string {
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

export function choose<T>(list: string, exponent?: number): string;
export function choose<T>(list: T[], exponent?: number): T;
export function choose<T>(list: T[] | string, exponent = 1): T | string {
	return list[Math.floor(Math.pow(Math.random(), exponent) * list.length)];
}

export function randomString(length: number): string {
	let result = '';

	for (let i = 0; i < length; i++) {
		result += Math.random().toString(36).slice(2)[0];
	}

	return result;
}

export function randRange(lo: number, hi?: number) {
	if (hi === undefined) {
		hi = lo;
		lo = 0;
	}
	return Math.floor(Math.random() * (hi - lo)) + lo;
}
