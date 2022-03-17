<script lang="ts">
	import { browser } from '$app/env';
	import { defaultParams } from '$lib/defaultParams';
	import { doMap } from '$lib/doMap';
	import * as d3 from 'd3';
	import { onMount } from 'svelte';

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

<button on:click={generate}>Generate Map</button>

<div id="container" />
