<script lang="ts">
  import { createEventDispatcher } from "svelte";

  export let type: "button" | "submit" | "reset" = "button";
  export let variant: "primary" | "secondary" | "accent" | "outline" =
    "primary";
  export let size: "sm" | "md" | "lg" = "md";
  export let disabled = false;
  export let loading = false;
  export let fullWidth = false;
  export let animate = true;

  const dispatch = createEventDispatcher();

  function handleClick(event: MouseEvent) {
    dispatch("click", event);
  }

  $: classes = `
    inline-flex items-center justify-center rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-offset-2
    transition-all duration-300 ease-in-out
    ${disabled || loading ? "opacity-50 cursor-not-allowed" : "hover:shadow-md"}
    ${fullWidth ? "w-full" : ""}
    ${animate ? "transform hover:-translate-y-0.5 active:translate-y-0" : ""}
    ${size === "sm" ? "px-3 py-1.5 text-sm" : size === "lg" ? "px-6 py-3 text-lg" : "px-4 py-2 text-base"}
    ${
      variant === "primary"
        ? "bg-primary text-white hover:bg-primary-dark focus:ring-primary"
        : variant === "secondary"
          ? "bg-secondary text-white hover:bg-secondary-dark focus:ring-secondary"
          : variant === "accent"
            ? "bg-accent text-white hover:bg-accent-dark focus:ring-accent"
            : "bg-transparent border border-primary text-primary hover:bg-primary hover:text-white focus:ring-primary"
    }
  `;
</script>

<button
  {type}
  class={classes}
  on:click={handleClick}
  {disabled}
  aria-disabled={disabled || loading}
>
  {#if loading}
    <svg
      class="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        class="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        stroke-width="4"
      ></circle>
      <path
        class="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      ></path>
    </svg>
  {/if}
  <slot>Button</slot>
</button>
