<script lang="ts">
	import { browser } from '$app/env';
	import { defaultParams, doMap } from '$lib/terrain';
	import { onMount } from 'svelte';
	onMount(() => {
		const svg = document.querySelector('svg');
		if (browser) {
			doMap(svg, defaultParams);
		}
	});
</script>

<h1>Welcome to SvelteKit</h1>
<p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p>
<svg id="final" height="400" width="400" viewBox="-500 -500 1000 1000" />
