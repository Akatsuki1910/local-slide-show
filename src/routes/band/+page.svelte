<script lang="ts">
	import { onMount } from 'svelte';
	import BandFiles from '../../components/BandFiles.svelte';
	import { API_URL, getApiTextData } from '../../ts/utils';

	const TEAMS = 20;
	let confTexts: string[] = $state([]);
	let texts: string[] = $state([]);
	let count = $state(0);

	const handleSubmit = async (e: SubmitEvent) => {
		e.preventDefault();

		const form = e.target as HTMLFormElement;
		const formData = new FormData(form);
		const names = formData.getAll('name[]');

		fetch(`${API_URL()}/soccer/conf/`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ text: names.join(',') })
		});

		const rankings = formData.getAll('ranking[]');

		fetch(`${API_URL()}/soccer/ranking-conf/`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ text: rankings.join(',') })
		});

		const files = formData.getAll('file[]') as File[];

		if (files.length > 0) {
			await Promise.all(
				files.map(async (v, i) => {
					if (!v?.name) {
						return;
					}

					const formData = new FormData();
					formData.append('id', `${i}`);
					formData.append('file', v);

					await fetch(`${API_URL()}/soccer/upload/`, {
						method: 'POST',
						body: formData
					});
				})
			);
		}
	};

	const handlerAdd = () => {
		count += 1;
		texts.push('');
	};

	const handlerDelete = () => {
		if (count > 0) {
			count -= 1;
			texts.pop();
		}
	};

	const handleSubmit2 = async (e: SubmitEvent) => {
		e.preventDefault();

		const form = e.target as HTMLFormElement;
		const formData = new FormData(form);
		const formTexts = formData.getAll('texts[]');

		fetch(`${API_URL()}/band/conf/`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ text: formTexts.join(',') })
		});
	};

	onMount(async () => {
		confTexts = await getApiTextData('soccer/conf/');

		texts = await getApiTextData('band/conf/');
		count = texts.length;
	});
</script>

<main>
	<h1>L字帯</h1>
	<form onsubmit={handleSubmit}>
		{#each Array(TEAMS) as _, i}
			<BandFiles {i} text={confTexts[i]} />
		{/each}
		<button type="submit">登録</button>
	</form>
	<p>テキスト</p>
	<form onsubmit={handleSubmit2}>
		<ul>
			{#each Array(count) as _, i}
				<li>
					<input type="text" value={texts[i]} name="texts[]" maxlength="30" />
				</li>
			{/each}
		</ul>
		<button type="button" onclick={handlerAdd}>追加</button>
		<button type="button" onclick={handlerDelete}>削除</button>
		<button type="submit">登録</button>
	</form>
</main>
