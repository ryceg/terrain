<script lang="ts">
	import { browser } from '$app/env';
	import { defaultParams } from '$lib/defaultParams';
	import { doMap } from '$lib/doMap';
	import type { Selection } from 'd3';
	import * as d3 from 'd3';
	import random from 'random';
	import seedrandom from 'seedrandom';
	import { onMount } from 'svelte';
	import * as RND from '../lib/random';

	export let seed: string;
	seed ??= RND.randomString(13);
	// $: {
	random.use(seedrandom(seed));
	// }
	$: browser && container && svg && generate(seed); // will run everytime seed changes
	let container;
	let svg: Selection<SVGSVGElement, any, any, HTMLElement>;

	onMount(() => {
		if (browser) {
			container = d3.select('div#container');
			svg = addSVG(container);
			generate(seed);
		}
		if (document) {
			document.title = d3.select('.region').text();
		}
	});

	function generate(newSeed) {
		random.use(seedrandom(newSeed));
		if (!svg) svg = addSVG(container);
		doMap(svg, defaultParams);
	}

	function addSVG(div) {
		return div
			.insert('svg', ':first-child')
			.attr('height', 800)
			.attr('width', 800)
			.attr('viewBox', '-500 -500 1000 1000');
	}
</script>

<div id="container" />
