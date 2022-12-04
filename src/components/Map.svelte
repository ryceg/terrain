<script lang="ts">
	import { browser } from '$app/environment';
	import { contour } from '$lib/contour';
	import { defaultExtent } from '$lib/defaultExtent';
	import { defaultParams } from '$lib/defaultParams';
	import { doMap } from '$lib/doMap';
	import { drawPaths } from '$lib/draw';
	import { generateCoast } from '$lib/generateCoast';
	import { getBorders } from '$lib/getBorders';
	import { getRivers } from '$lib/getRivers';
	import { getTerritories } from '$lib/getTerritories';
	import { getTextArrayFromQuery } from '$lib/getTextArrayFromQuery';
	import { cityNames, regionNames } from '$lib/stores/regionNames';
	import { visualizeCities, visualizeSlopes } from '$lib/visualize';
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
		generate(seed);
	});

	function generate(newSeed) {
		random.use(seedrandom(newSeed));
		if (!container) container = d3.select('div#container');
		if (!svg) svg = addSVG(container);

		// // works
		// const primH = zero(generateGoodMesh(4096));
		// visualizeVoronoi(svg, primH, -1, 1);
		// drawPaths(svg, 'coast', contour(primH, 0));

		// works
		const cityRender = {
			params: defaultParams,
			cities: [],
			h: generateCoast({ npts: 4096, extent: defaultExtent })
		};

		cityRender.terr = getTerritories(cityRender);

		drawPaths(svg, 'coast', contour(cityRender.h, 0));
		drawPaths(svg, 'river', getRivers(cityRender.h, 0.01));
		drawPaths(svg, 'border', getBorders(cityRender));
		visualizeSlopes(svg, cityRender);
		visualizeCities(svg, cityRender);
		// visualizeVoronoi(svg, physH, -1, 1);

		doMap(svg, defaultParams);

		// const physH = generateCoast({ npts: 4096, extent: defaultExtent });
		// visualizeVoronoi(svg, physH, -1, 1);
		// drawPaths(svg, 'coast', contour(physH, 0));
		// drawPaths(svg, 'coast', []);
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
