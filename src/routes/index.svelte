<script lang="ts">
	import { browser } from '$app/env';
	import { defaultParams } from '$lib/defaultParams';
	import { doMap } from '$lib/doMap';
	import { onMount } from 'svelte';
	let svg: SVGSVGElement;
	onMount(() => {
		if (browser) {
			doMap(svg, defaultParams);
		}
	});
</script>

<h1>Terrain</h1>
<p>A map generator</p>
<div>
	<svg bind:this={svg} id="final" height="400" width="400" viewBox="-500 -500 1000 1000" />
</div>
