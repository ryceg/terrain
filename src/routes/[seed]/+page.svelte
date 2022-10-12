<script lang="ts">
	import { page } from '$app/stores';
	import Map from '../../components/Map.svelte';
	$: seed = $page.params.seed;
</script>

<Map {seed} />
