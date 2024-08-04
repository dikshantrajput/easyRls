<script lang="ts">
  import "../app.css";
  import { onMount } from "svelte";
  import { theme } from "$lib/stores/theme";
  import { ThemesEnum } from "$lib/types/core";
  import ThemeToggler from "$lib/components/ThemeToggler.svelte";
  import { THEME_LOCALSTORAGE_KEY } from "$lib/constants";
  import { toast, Toaster } from "svelte-sonner";
  import { beforeNavigate } from "$app/navigation";
  import { referrerStore } from "$lib/stores/referrer";
  import Icon from "@iconify/svelte";
  import { navigating } from "$app/stores";
  import Loader from "$lib/components/Loader.svelte";

  beforeNavigate((navigation) => {
    if (navigation.from?.url) {
      referrerStore.set(navigation.from.url.href);
    }
  });

  $: isNavigating = !!$navigating;
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
    <div class="flex gap-3 items-center">
      <a href="/" class="dark:text-secondary text-primary text-2xl">
        EasyRls
      </a>
      {#if isNavigating}
        <Loader color="secondary" />
      {/if}
    </div>
    <nav class="flex items-center gap-3">
      <a
        href="https://www.producthunt.com/posts/easyrls?embed=true&utm_source=badge-featured&utm_medium=badge&utm_souce=badge-easyrls"
        target="_blank"
        ><img
          src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=476455&theme=light"
          alt="EasyRLS - Simplify&#0032;PostgreSQL&#0032;Row&#0032;Level&#0032;Security | Product Hunt"
          style="width: 250px; height: 54px;"
          width="250"
          height="54"
        /></a
      >
      <a
        href="https://github.com/dikshantrajput/easyRls"
        target="_blank"
        rel="noopener noreferrer"
        class="text-3xl"
      >
        <Icon icon="mdi:github" />
      </a>
      <ThemeToggler />
    </nav>
  </nav>

  <main>
    <slot />
  </main>
</div>

<Toaster duration={3000} richColors />
