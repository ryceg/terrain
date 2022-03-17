<script lang="ts">
	import { browser } from '$app/env';
	import { defaultParams } from '$lib/defaultParams';
	import { doMap } from '$lib/doMap';
	import * as d3 from 'd3';
	import random from 'random';
	import seedrandom from 'seedrandom';
	import { onMount } from 'svelte';
	import * as RND from '../lib/random';

	let seed = RND.randomString(13);
	random.use(seedrandom(seed));

	let container: any = '';
	let svg = '';

	onMount(() => {
		if (browser) {
			container = d3.select('div#container');
			svg = addSVG(container);
			generate();
		}
	});

	function generate() {
		random.use(seedrandom(seed));
		doMap(svg, defaultParams);
	}

	function generateRandom() {
		seed = RND.randomString(13);
		random.use(seedrandom(seed));
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

<h1>Terrain</h1>

<p>A map generator</p>

<label for="seed">Random Seed</label>
<input type="text" name="seed" bind:value={seed} id="seed" />

<button on:click={generate}>Generate Map From Seed</button>

<button on:click={generateRandom}>Generate Map With Random Seed</button>

<div id="container" />
