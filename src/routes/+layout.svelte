<script>
</script>

<head>
	<title>Terrain</title>
</head>

<slot />

<style>
	path,
	line {
		fill: none;
		stroke: black;
		stroke-linecap: round;
	}

	.field {
		stroke: none;
		fill-opacity: 1;
	}

	.slope {
		stroke-width: 1;
	}

	.river {
		stroke-width: 2;
	}

	.coast {
		stroke-width: 4;
	}

	.border {
		stroke-width: 5;
		stroke-dasharray: 4, 4;
		stroke-linecap: butt;
	}

	text {
		font-family: 'Palatino Linotype', 'Book Antiqua', Palatino, serif;
		color: black;
		stroke: white;
		stroke-width: 5;
		stroke-linejoin: round;
		paint-order: stroke;
	}

	text.region {
		stroke-width: 10;
		font-variant: small-caps;
	}

	svg {
		float: right;
		background-color: white;
	}
</style>
