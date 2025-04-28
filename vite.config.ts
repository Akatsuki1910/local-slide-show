import { defineConfig } from "vite";
import { sveltekit } from '@sveltejs/kit/vite';
// import { viteSingleFile } from "vite-plugin-singlefile";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    sveltekit(),
    // viteSingleFile()
  ],
});
