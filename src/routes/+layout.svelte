<script lang="ts">
  import "../app.css";
  import { onMount } from "svelte";
  import { theme } from "$lib/stores/theme";
  import { ThemesEnum } from "$lib/types/core";
  import ThemeToggler from "$lib/components/ThemeToggler.svelte";
  import { THEME_LOCALSTORAGE_KEY } from "$lib/constants";

  onMount(() => {
    const savedTheme = localStorage.getItem(
      THEME_LOCALSTORAGE_KEY,
    ) as ThemesEnum;
    if (savedTheme) {
      theme.set(savedTheme);
    } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      theme.set(ThemesEnum.DARK);
    }
  });
</script>

<div class="min-h-screen bg-background text-text">
  <nav class="p-4 bg-background-light">
    <ThemeToggler />
  </nav>

  <main class="p-4">
    <slot />
  </main>
</div>
