<script lang="ts">
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

<h1>Terrain</h1>

<p>A map generator</p>

<label for="seed">Random Seed</label>
<input type="text" name="seed" bind:value={inputSeed} id="seed" />

<button on:click={generate}>Generate Map From Seed</button>

<button on:click={generateRandom}>Generate Map With Random Seed</button>

<Map {seed} />
