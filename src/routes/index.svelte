<script>
	import { addSVG, defaultParams, doMap } from '$lib/terrain';
	import { onMount } from 'svelte';
	onMount(() => {
		doMap(addSVG('final'), defaultParams);
	});
</script>

<h1>Welcome to SvelteKit</h1>
<p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p>
<div id="final" />
