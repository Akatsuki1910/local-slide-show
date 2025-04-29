<script lang="ts">
	import { onMount } from 'svelte';
	import { API_URL, getImage } from '../ts/utils';

	let images: string[] = $state([]);
	let slideIndex = $state(0);

	$effect(() => {
		const interval = setInterval(() => {
			if (images.length === 0) return;
			slideIndex = (slideIndex + 1) % images.length;
		}, 5000);

		return () => {
			clearInterval(interval);
		};
	});

	onMount(() => {
		const interval = setInterval(async () => {
			const res = await fetch(`${API_URL}/select-conf/`);
			if (res.ok) {
				const data = await res.json();
				const dataArr = data.text.split(',');

				if (images.sort().join(',') !== dataArr.sort().join(',')) {
					images = dataArr;
					slideIndex = 0;
				}
			}
		}, 10000);

		return () => {
			clearInterval(interval);
		};
	});
</script>

<main>
	{#each images as img, i}
		<img
			class="slide-image"
			class:active={i === slideIndex}
			src={getImage(img)}
			alt=""
			id={`image_${i}`}
		/>
	{/each}
</main>

<style lang="scss">
	main {
		overflow: hidden;
	}

	.slide-image {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		object-fit: contain;
		transition-property: opacity;
		opacity: 0;
		transition-duration: 1s;
	}

	.active {
		opacity: 1;
	}
</style>
