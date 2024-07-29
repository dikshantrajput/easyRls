<script lang="ts">
  import { createEventDispatcher, onMount } from "svelte";
  import { fade } from "svelte/transition";
  import Button from "./Button.svelte";

  export let showButtonLoader = false;
  let connectionString = "";
  let isValid = false;
  let isTouched = false;
  let isLoading = false;

  const validateConnectionString = async () => {
    if (!connectionString) {
      isValid = false;
      return;
    }

    isLoading = true;

    // This is a basic regex for PostgreSQL connection string validation
    // You may want to enhance this based on your specific requirements
    const regex = /^postgres|psql(ql)?:\/\/([^:]+):([^@]+)@([^:]+):(\d+)\/(.+)$/;
    isValid = regex.test(connectionString);

    isLoading = false;
  };

  onMount(() => {
    const input = document.getElementById("connection-string");
    if (input) {
      input.focus();
    }
  });
</script>

<div class="mx-auto py-6">
  <label
    for="connection-string"
    class="block text-sm font-medium text-text mb-2"
  >
    Enter your PostgreSQL Connection String
  </label>
  <div class="relative">
    <input
      type="text"
      id="connection-string"
      bind:value={connectionString}
      on:input={() => {
        isTouched = true;
        validateConnectionString();
      }}
      class="w-full px-4 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-primary focus:border-primary bg-background text-text {isTouched &&
        !isValid &&
        'focus:ring-error focus:border-error border-error outline-none'} transition-all"
      placeholder="postgres://username:password@host:port/database"
      name="url"
      required
    />
    {#if isLoading}
      <div class="absolute right-3 top-2.5" transition:fade>
        <div
          class="w-5 h-5 border-t-2 border-primary border-solid rounded-full animate-spin"
        ></div>
      </div>
    {:else if isTouched}
      <div class="absolute right-3 top-2.5" transition:fade>
        {#if isValid}
          <svg
            class="w-6 h-6 text-success"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M5 13l4 4L19 7"
            ></path>
          </svg>
        {:else}
          <svg
            class="w-6 h-6 text-error"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            ></path>
          </svg>
        {/if}
      </div>
    {/if}
    <div class="mt-3">
      <Button type="submit" loading={showButtonLoader} disabled={!isValid}>
        Connect
      </Button>
    </div>
  </div>
  {#if isTouched && !isValid}
    <p class="mt-2 text-sm text-error" transition:fade>
      Please enter a valid PostgreSQL connection string.
    </p>
  {/if}
</div>
