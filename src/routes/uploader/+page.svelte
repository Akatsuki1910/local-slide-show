<script lang="ts">
	import { WEB_URL } from '../../ts/utils';

	let files: FileList | null | undefined = $state();
	let filesArr: File[] = [];

	$effect(() => {
		if (files) {
			for (const file of files) {
				filesArr.push(file);
			}
		}
	});

	const handleSubmit = async (e: SubmitEvent) => {
		e.preventDefault();

		if (filesArr.length > 0) {
			for await (const file of filesArr) {
				const formData = new FormData();
				formData.append('file', file);

				await fetch(`${WEB_URL}/api/upload/`, {
					method: 'POST',
					body: formData
				});
			}

			filesArr = [];
		}
	};
</script>

<main>
	<h1>UPLOADER</h1>
	<form method="dialog" onsubmit={handleSubmit}>
		<p>Choose a file:</p>
		<input type="file" bind:files multiple />
		<button type="submit">OK</button>
	</form>
</main>
