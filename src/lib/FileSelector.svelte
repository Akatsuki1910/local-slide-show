<script lang="ts">
  import { untrack } from "svelte";

  let {
    open = $bindable(),
    openFn,
    closeFn,
    setImages,
  }: {
    open: boolean;
    openFn: () => void;
    closeFn: () => void;
    setImages: (imgs: string[]) => void;
  } = $props();

  let files: FileList | null | undefined = $state();
  let filesArr: File[] = [];

  $effect(() => {
    if (files) {
      for (const file of files) {
        filesArr.push(file);
      }
    }
  });

  let element: HTMLDialogElement | undefined;

  function toggleDialog() {
    if (element === undefined) {
      return;
    }
    if (open) {
      element.showModal();
    } else {
      element.close();
    }
  }

  $effect.pre(() => {
    open;
    untrack(() => toggleDialog());
  });

  const handleSubmit = (e: SubmitEvent) => {
    e.preventDefault();

    if (filesArr.length > 0) {
      const imgUrls = filesArr.map((file) => URL.createObjectURL(file));
      setImages(imgUrls);

      filesArr = [];
    }

    closeFn();
  };
</script>

<dialog bind:this={element} oncancel={closeFn}>
  <form method="dialog" onsubmit={handleSubmit}>
    <p>Choose a file:</p>
    <input type="file" bind:files multiple />
    <button type="submit">OK</button>
    <button type="reset">Cancel</button>
  </form>
</dialog>
