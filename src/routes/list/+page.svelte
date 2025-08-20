<script lang="ts">
	import { onMount } from 'svelte';
	import { API_URL, getImage } from '../../ts/utils';

	let files: string[] = $state([]);
	let isEdit = $state(false);
	let activeImages = $state(new Set<string>());
	let selectImages = $state(new Set<string>());

	async function loadImages() {
		const res = await fetch(`${API_URL()}/files/`);
		files = (await res.json()).filter((v: string) => v !== '.gitkeep').reverse();
	}

	async function handlerDeleteImage(filename: string) {
		const res = await fetch(`${API_URL()}/select-conf/`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ text: Array.from(selectImages).join(',') })
		});
		const res2 = await fetch(`${API_URL()}/deleteFile/`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ filename: filename })
		});
		if (res.ok && res2.ok) {
			location.reload();
		}
	}

	async function handlerSelectImage() {
		const res = await fetch(`${API_URL()}/select-conf/`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ text: Array.from(selectImages).join(',') })
		});
		if (res.ok) {
			activeImages = selectImages;
			isEdit = false;
		}
	}

	onMount(async () => {
		const res = await fetch(`${API_URL()}/select-conf/`);
		if (res.ok) {
			const data = await res.json();
			if (!data.text) {
				return;
			}

			activeImages = new Set<string>(data.text.split(','));
			console.log('data', activeImages);
			selectImages = activeImages;
		}
	});

	onMount(() => {
		loadImages();
	});
</script>

<main>
	<h1>PICKER</h1>
	{#if isEdit}
		<button type="button" onclick={handlerSelectImage}>SELECT</button>
		<button
			type="button"
			onclick={() => {
				isEdit = false;
				selectImages = activeImages;
			}}
		>
			CANCEL
		</button>
	{:else}
		<button type="button" onclick={() => (isEdit = true)}>EDIT</button>
	{/if}
	<div class="files">
		{#each files as file}
			<div class="button-wrapper">
				<button
					class="button"
					type="button"
					disabled={!isEdit}
					class:active={selectImages.has(file)}
					onclick={() => {
						const updated = new Set(selectImages);

						if (updated.has(file)) {
							updated.delete(file);
						} else {
							updated.add(file);
						}

						console.log('updated', updated);

						selectImages = updated;
					}}
				>
					<img src={getImage(file)} alt="" />
				</button>
				{#if !isEdit}
					<button
						class="delete-button"
						type="button"
						onclick={async () => {
							const updated = new Set(selectImages);
							updated.delete(file);

							selectImages = updated;
							await handlerDeleteImage(file);
						}}
					>
						D
					</button>
				{/if}
			</div>
		{/each}
	</div>
</main>

<style lang="scss">
	.files {
		display: flex;
		flex-wrap: wrap;
		gap: 10px;
	}

	.button-wrapper {
		position: relative;
	}

	.button {
		position: relative;
		background: none;
		border-width: 5px;
		border-style: solid;
		border-color: black;
		padding: 0;
		cursor: pointer;

		&:disabled {
			cursor: default;
		}

		&.active {
			border-color: red;
		}
	}

	img {
		width: 200px;
		height: 200px;
		object-fit: contain;
	}

	.delete-button {
		position: absolute;
		right: 0;
		bottom: 0;
	}
</style>
