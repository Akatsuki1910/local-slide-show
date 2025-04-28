<script lang="ts">
  import FileSelector from "./lib/FileSelector.svelte";

  let images: string[] = $state([]);
  let open = $state(false);
  let slideIndex = $state(0);

  function openFn() {
    open = true;
  }
  function closeFn() {
    open = false;
  }
  function setImages(imgs: string[]) {
    slideIndex = 0;
    for (let i = 0; i < images.length; i++) {
      document.getElementById(`image_${i}`)!.removeAttribute("data-active");
    }

    images = imgs;
  }

  const preventEsc = (ev: KeyboardEvent) => {
    if (ev.key === "Escape") {
      ev.preventDefault();
      if (open) {
        closeFn();
      } else {
        openFn();
      }
    }
  };

  $effect(() => {
    const interval = setInterval(() => {
      if (images.length === 0) return;
      slideIndex = (slideIndex + 1) % images.length;
    }, 5000);

    return () => {
      clearInterval(interval);
    };
  });
</script>

<svelte:window onkeydown={preventEsc} />
<main>
  {#each images as img, i}
    <img
      class="slide-image"
      class:active={i === slideIndex}
      src={img}
      alt=""
      id={`image_${i}`}
    />
  {/each}
  <FileSelector bind:open {openFn} {closeFn} {setImages}></FileSelector>
</main>

<style lang="scss">
  .slide-image {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: contain;
    transition-property: opacity;
    opacity: 0;
    transition-duration: 3s;
  }

  .active {
    opacity: 1;
  }
</style>
