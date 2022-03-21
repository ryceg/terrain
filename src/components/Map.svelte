<script lang="ts">
	import { browser } from '$app/env';
	import { defaultParams } from '$lib/defaultParams';
	import { doMap } from '$lib/doMap';
	import { getTextArrayFromQuery } from '$lib/getTextArrayFromQuery';
	import { cityNames, regionNames } from '$lib/stores/regionNames';
	import type { Selection } from 'd3';
	import * as d3 from 'd3';
	import random from 'random';
	import seedrandom from 'seedrandom';
	import { onMount } from 'svelte';
	import { blur } from 'svelte/transition';
	import * as RND from '../lib/random';

	export let seed: string;
	let loading = true;
	seed ??= RND.randomString(13);
	// $: {
	random.use(seedrandom(seed));
	// }
	$: browser && container && svg && generate(seed); // will run everytime seed changes
	let container;
	let svg: Selection<SVGSVGElement, any, any, HTMLElement>;

	onMount(() => {
		if (browser) {
			generate(seed);
		}
	});

	function generate(newSeed) {
		random.use(seedrandom(newSeed));
		if (!container) container = d3.select('div#container');
		if (!svg) svg = addSVG(container);
		doMap(svg, defaultParams);
		loading = !loading;
		// convert HTML collection to an array of the region names
		$regionNames = getTextArrayFromQuery('.region');
		$cityNames = getTextArrayFromQuery('.city');
		console.log($cityNames);
		if (document) {
			document.title = d3.select('.region').text();
		}
	}

	function addSVG(div) {
		return div
			.insert('svg', ':first-child')
			.attr('height', 800)
			.attr('width', 800)
			.attr('viewBox', '-500 -500 1000 1000');
	}
</script>

{#if loading}
	<span transition:blur>Loading...</span>
{/if}
<div id="container" class={loading ? '' : 'isLoaded'} />

<style>
	.isLoaded {
		animation: ease-in fade-in 3s;
	}

	@keyframes fade-in {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}
</style>
