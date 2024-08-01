<script lang="ts">
    import { goto } from "$app/navigation";
    import { page } from "$app/stores";
  import type { DatabaseSchemaInterface } from "$lib/managers/schema.manager";
    import Icon from "@iconify/svelte";
  import { createEventDispatcher } from "svelte";
  import { fade, fly } from "svelte/transition";

  export let schemas: DatabaseSchemaInterface[] = [],
    dbName: string;

  let searchTerm = "";

  $: filteredSchemas = schemas.filter((schema) =>
    schema.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const dispatch = createEventDispatcher<{
    viewTable: string;
  }>();

  const dispatchViewTableClickEvent = (name: string) => {
    dispatch("viewTable", name);
  };

  const navigateBack = () => {
    goto(`/`);
  };
</script>

<div class="max-w-4xl mx-auto p-6 bg-background rounded-lg shadow-md">
  <div class="flex items-center mb-6">
    <button on:click={navigateBack}>
      <Icon icon="ep:back" height="25" width="25" />
    </button>
    <h2 class="text-2xl font-semibold text-text ml-3">
      Schemas in <span class="text-primary"><i>{dbName}</i></span>
    </h2>
  </div>

  <input
    type="text"
    placeholder="Search schemas..."
    bind:value={searchTerm}
    class="w-full p-2 mb-6 border border-background-dark rounded-md bg-background-light text-text"
  />

  {#if filteredSchemas.length === 0}
    <p class="text-text-muted" transition:fade>
      No schemas found in the database.
    </p>
  {:else}
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {#each filteredSchemas as schema, i (schema.name)}
        <div
          class="bg-background-light rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden flex flex-col justify-between"
          transition:fly={{ y: 50, duration: 300, delay: i * 50 }}
        >
          <div class="p-4">
            <div class="flex items-center justify-between mb-2">
              <h3 class="text-lg font-medium text-text">{schema.name}</h3>
              <span
                class="text-xs font-semibold text-text-muted bg-background px-2 py-1 rounded-full"
              >
                {schema.tableCount}
                {schema.tableCount === 1 ? "table" : "tables"}
              </span>
            </div>
            <p class="text-sm text-text-muted">
              {schema.tableCount}
              {schema.tableCount === 1 ? "table" : "tables"} in this schema
            </p>
          </div>
          <button
            class="text-sm text-primary hover:text-primary-dark transition-colors duration-200 bg-primary bg-opacity-10 px-4 py-2 flex justify-between items-center w-full"
            on:click={() => dispatchViewTableClickEvent(schema.name)}
          >
            View Tables
            <svg
              class="w-5 h-5 text-primary"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 5l7 7-7 7"
              ></path>
            </svg>
          </button>
        </div>
      {/each}
    </div>
  {/if}
</div>
