<script lang="ts">
	import { cityNames, regionNames } from '$lib/stores/regionNames';
	import { fade } from 'svelte/transition';
	import Map from '../components/Map.svelte';
	import * as RND from '../lib/random';
	let inputSeed = RND.randomString(13);
	let seed = inputSeed;
	function generate() {
		if (inputSeed !== seed) seed = inputSeed;
	}

	function generateRandom() {
		seed = RND.randomString(13);
	}
</script>

<h1>
	The Terrain
	{#if $regionNames}
		<span transition:fade> of {$regionNames[0]}</span>
	{/if}
</h1>
<p>
	A map generator {#if $cityNames}
		<span transition:fade>
			for the nearby cities of {$cityNames[0]}, {$cityNames[1]}, and {$cityNames[2]}
		</span>
	{/if}
</p>

<label for="seed">Random Seed</label>
<input type="text" name="seed" bind:value={inputSeed} id="seed" />

<button on:click={generate}>Generate Map From Seed</button>

<button on:click={generateRandom}>Generate Map With Random Seed</button>

<Map {seed} />
