<script lang="ts">
	import { API_URL } from '../../ts/utils';

	let files: FileList | null | undefined = $state();
	let filesArr: File[] = $state([]);
	let input: HTMLInputElement | null = null;

	$effect(() => {
		if (files) {
			const arr = [...filesArr];
			for (const file of files) {
				arr.push(file);
			}
			filesArr = arr;
			files = undefined;

			if (input) {
				input.value = '';
			}
		}
	});

	const handleSubmit = async (e: SubmitEvent) => {
		e.preventDefault();

		if (filesArr.length > 0) {
			for await (const file of filesArr) {
				const formData = new FormData();
				formData.append('file', file);

				await fetch(`${API_URL()}/upload/`, {
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
		<label class="file-input">
			<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px">
				<path
					d="M480-320 280-520l56-58 104 104v-326h80v326l104-104 56 58-200 200ZM240-160q-33 0-56.5-23.5T160-240v-120h80v120h480v-120h80v120q0 33-23.5 56.5T720-160H240Z"
				/>
			</svg>
			<p>ファイルを選択するか、ドラッグアンドドロップしてください</p>
			<input type="file" bind:files bind:this={input} accept="image/*" multiple />
		</label>
		<button type="submit" class="submit">送信</button>
	</form>
	<div class="image-wrapper">
		{#each filesArr as file, i}
			<div class="image-item">
				<img src={URL.createObjectURL(file)} alt={file.name} />
				<button type="button" onclick={() => filesArr.splice(i, 1)} aria-label="Remove">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						height="24px"
						viewBox="0 -960 960 960"
						width="24px"
					>
						<path
							d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"
						/>
					</svg>
				</button>
			</div>
		{/each}
	</div>
</main>

<style lang="scss">
	.file-input {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 50%;
		height: 200px;
		border: 2px dashed #ccc;
		border-radius: 10px;
		background-color: #f9f9f9;
		margin: 0 auto 10px;
		position: relative;

		input {
			cursor: pointer;
			display: block;
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
			opacity: 0;
		}
	}

	.submit {
		display: flex;
		margin: 0 auto;
	}

	.image-wrapper {
		display: flex;
		flex-wrap: wrap;
		gap: 10px;
	}

	.image-item {
		border: 5px solid black;
	}

	img {
		width: 200px;
		height: 200px;
		object-fit: contain;
	}
</style>
