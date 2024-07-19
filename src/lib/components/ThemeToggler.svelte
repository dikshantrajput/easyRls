<script>
  import { theme } from "$lib/stores/theme";
  import { ThemesEnum } from "$lib/types/core";
  import { onMount } from "svelte";

  function toggleTheme() {
    theme.toggle();
  }

  onMount(() => {
    return theme.subscribe((value) => {
      document.documentElement.classList.toggle(
        ThemesEnum.DARK,
        value === ThemesEnum.DARK,
      );
    });
  });
</script>

<button
  on:click={toggleTheme}
  class="p-2 rounded-full bg-background-light text-text"
>
  {#if $theme === ThemesEnum.DARK}
    🌙
  {:else}
    ☀️
  {/if}
</button>
