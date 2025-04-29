<script lang="ts">
	import { onMount } from 'svelte';
	import { WEB_URL, getImage } from '../../ts/utils';

	let files: string[] = $state([]);
	let selectImages = $state(new Set<string>());

	async function loadImages() {
		const res = await fetch(`${WEB_URL}/api/files/`);
		files = (await res.json()).filter((v: string) => v !== '.gitkeep');
	}

	async function handlerSelectImage() {
		const res = await fetch(`${WEB_URL}/api/select-conf/`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ text: Array.from(selectImages).join(',') })
		});
		if (res.ok) {
			const data = await res.json();
			console.log(data);
		}
	}

	onMount(async () => {
		const res = await fetch(`${WEB_URL}/api/select-conf/`);
		if (res.ok) {
			const data = await res.json();
			selectImages = new Set<string>(data.text.split(','));
		}
	});

	onMount(() => {
		loadImages();
	});
</script>

<main>
	<h1>PICKER</h1>
	<button type="button" onclick={handlerSelectImage}>SELECT!</button>
	<div class="files">
		{#each files as file}
			<button
				class="button"
				type="button"
				class:active={selectImages.has(file)}
				onclick={() => {
					const updated = new Set(selectImages);

					if (updated.has(file)) {
						updated.delete(file);
					} else {
						updated.add(file);
					}

					selectImages = updated;
				}}
			>
				<img src={getImage(file)} alt="" />
			</button>
		{/each}
	</div>
</main>

<style lang="scss">
	.files {
		display: flex;
		flex-wrap: wrap;
		gap: 10px;
	}

	.button {
		background: none;
		border-width: 5px;
		border-style: solid;
		border-color: black;
		padding: 0;
		cursor: pointer;
	}

	.active {
		border-color: red;
	}

	img {
		width: 200px;
		height: 200px;
		object-fit: contain;
	}
</style>
