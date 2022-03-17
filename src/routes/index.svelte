<script lang="ts">
	import { browser } from '$app/env';
	import * as Render from '$lib/renderEverything';
	import { onMount } from 'svelte';

	onMount(() => {
		if (browser) {
			Render.render();
		}
	});
</script>

<h1>Terrain</h1>

<p>A map generator</p>

<div id="container" />
