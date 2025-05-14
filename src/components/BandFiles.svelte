<script lang="ts">
	import { onMount } from 'svelte';
	import { getImage } from '../ts/utils';

	export const prerender = false;

	const { i, text, checked } = $props();

	let files: FileList | null | undefined = $state();
	let file: File | null = $state(null);
	let imagePath = $state<string>('');

	$effect(() => {
		if (files) {
			file = files[0];
		}
	});

	onMount(async () => {
		imagePath = getImage(`soccer/${i}.png`);
	});
</script>

<div class="wrapper">
	<label class="label">
		<img src={file ? URL.createObjectURL(file) : imagePath} alt="" />
		<input bind:files type="file" accept="image/png" name="file[]" />
	</label>
	<input type="text" placeholder="チーム名" name="name[]" value={text || ''} />
	<input
		type="number"
		step="1"
		min="1"
		max="20"
		placeholder="ランキング"
		name="ranking[]"
		value={i + 1}
	/>
	<input type="radio" name="team" value={i} id={`team${i + 1}`} {checked} />
</div>

<style lang="scss">
	.wrapper {
		display: flex;
		gap: 10px;
	}

	.label {
		display: block;
		width: 30px;
		height: 30px;
		border: 1px solid black;

		img {
			width: 100%;
			height: 100%;
			object-fit: contain;
		}

		input {
			display: none;
		}
	}
</style>
