<script lang="ts">
	import { onMount } from 'svelte';
	import { WEB_URL } from '../../ts/utils';

	let files: string[] = $state([]);

	async function loadImages() {
		const res = await fetch(`${WEB_URL}/api/files/`);
		files = (await res.json()).filter((v: string) => v !== '.gitkeep');
	}

	onMount(() => {
		loadImages();
	});
</script>

<main>
	<h1>PICKER</h1>
	<div class="files">
		{#each files as file}
			<img src={`${WEB_URL}/api/uploads/${file}`} alt="" />
		{/each}
	</div>
</main>

<style lang="scss">
	.files {
		display: flex;
		flex-wrap: wrap;
		gap: 10px;
	}

	img {
		width: 200px;
		height: 200px;
		object-fit: contain;
		border: 1px solid black;
	}
</style>
