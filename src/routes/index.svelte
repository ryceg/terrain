<script lang="ts">
	import { defaultParams } from '$lib/defaultParams';
	import { doMap } from '$lib/doMap';
	import random from 'random';
	import seedrandom from 'seedrandom';
	import Map from '../components/Map.svelte';
	import * as RND from '../lib/random';
	let inputSeed = RND.randomString(13);
	let seed = inputSeed;
	random.use(seedrandom(seed));

	let svg = '';

	function generate() {
		if (inputSeed !== seed) {
			seed = inputSeed;
			random.use(seedrandom(seed));
			doMap(svg, defaultParams);
		}
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
<input type="text" name="seed" bind:value={inputSeed} id="seed" />

<button on:click={generate}>Generate Map From Seed</button>

<button on:click={generateRandom}>Generate Map With Random Seed</button>

<Map {seed} />
