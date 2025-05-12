<script lang="ts">
	import { onMount } from 'svelte';
	import { API_URL, getApiTextData, getImage } from '../ts/utils';

	let images: string[] = $state([]);
	let slideIndex = $state(0);

	let soccerData: {
		id: number;
		name: string;
	}[] = $state([]);
	let bandTexts: string[] = $state([]);

	$effect(() => {
		const interval = setInterval(() => {
			if (images.length === 0) return;
			slideIndex = (slideIndex + 1) % images.length;
		}, 5000);

		return () => {
			clearInterval(interval);
		};
	});

	const getData = async () => {
		const res = await fetch(`${API_URL()}/select-conf/`);
		if (res.ok) {
			const data = await res.json();
			const dataArr = data.text.split(',');

			if (images.sort().join(',') !== dataArr.sort().join(',')) {
				images = dataArr;
				slideIndex = 0;
			}
		}

		let soccerConfTexts: string[] = [];
		let soccerRankingTexts: string[] = [];

		const res2 = await getApiTextData('/soccer/conf/');
		if (res2) {
			soccerConfTexts = res2.split(',');
		}
		const res3 = await getApiTextData('/soccer/ranking-conf/');
		if (res3) {
			soccerRankingTexts = res3.split(',');
		}
		const res4 = await getApiTextData('/band/conf/');
		if (res4) {
			bandTexts = res4.split(',');
		}

		const soccerDataMem = [];
		for (let i = 0; i < soccerConfTexts.length; i++) {
			const name = soccerConfTexts[i];
			const ranking = soccerRankingTexts[i];
			soccerDataMem[Number(ranking) - 1] = { id: i, name };
		}

		if (
			soccerData.map((d) => d.name + d.id).join(',') !==
			soccerDataMem.map((d) => d.name + d.id).join(',')
		) {
			soccerData = soccerDataMem;
		}
	};

	onMount(() => {
		const interval = setInterval(async () => {
			await getData();
		}, 10000);

		getData();

		return () => {
			clearInterval(interval);
		};
	});
</script>

<main class="wrapper">
	<div class="left">
		<h2>順位表</h2>
		<table>
			<tbody>
				{#each soccerData as d}
					<tr>
						<td><img src={getImage(`soccer/${d.id}.png`)} alt="" /></td>
						<td>{d.name}</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
	<div class="main">
		{#each images as img, i}
			<img
				class="slide-image"
				class:active={i === slideIndex}
				src={getImage(img)}
				alt=""
				id={`image_${i}`}
			/>
		{/each}
	</div>
	<!-- <div class="bottom">
		{#each bandTexts as text}
			<p class="text">{text}</p>
		{/each}
	</div> -->
</main>

<style lang="scss">
	.wrapper {
		overflow: hidden;
		display: grid;
		grid-template-areas: 'left main';
		/* 'bottom bottom'; */
		grid-template-columns: 30vmin 1fr;
		/* grid-template-rows: 1fr 30vmin; */
		width: 100%;
		height: 100%;
	}

	.main {
		position: relative;
		width: 100%;
		height: 100%;
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

	.left {
		grid-area: left;

		h2 {
			text-align: center;
			margin: 10px 0;
			padding: 0;
		}

		tbody {
			display: flex;
			flex-direction: column;
			justify-content: space-between;
		}

		tr {
			display: grid;
			grid-template-columns: auto 1fr;
			align-items: center;
			gap: 2px;

			img {
				width: 'auto';
				height: calc((100vh - 30vmin) / 20);
			}
		}
	}

	.bottom {
		grid-area: bottom;
		display: flex;
		align-items: center;
		justify-content: center;
	}
</style>
