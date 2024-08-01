<script lang="ts">
  import "../app.css";
  import { onMount } from "svelte";
  import { theme } from "$lib/stores/theme";
  import { ThemesEnum } from "$lib/types/core";
  import ThemeToggler from "$lib/components/ThemeToggler.svelte";
  import { THEME_LOCALSTORAGE_KEY } from "$lib/constants";
  import { Toaster } from "svelte-sonner";
  import { beforeNavigate } from "$app/navigation";
  import { referrerStore } from "$lib/stores/referrer";

  beforeNavigate((navigation) => {
    if (navigation.from?.url) {
      referrerStore.set(navigation.from.url.href);
    }
  });

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
  <nav class="p-4 bg-background-light flex justify-between items-center px-5">
    <a href="/" class="text-secondary text-2xl"> EasyRls </a>
    <ThemeToggler />
  </nav>

  <main class="p-4">
    <slot />
  </main>
</div>

<Toaster duration={3000} richColors />
