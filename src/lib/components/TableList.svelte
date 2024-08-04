<script lang="ts">
  import type { DatabaseTableInterface } from "$lib/managers/table.manager";
  import { createEventDispatcher } from "svelte";
  import { fade, fly } from "svelte/transition";
  import Button from "./Button.svelte";
    import Icon from "@iconify/svelte";
    import { referrerStore } from "$lib/stores/referrer";
    import { goto } from "$app/navigation";
    import { page } from "$app/stores";

  export let schemaName: string,
    tables: DatabaseTableInterface[] = [];

  const dispatch = createEventDispatcher<{
    manage: {
      tableName: string;
    };
  }>();
  let searchTerm = "";

  $: filteredTables = tables.filter((table) =>
    table.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const dispatchManageRlsClickEvent = (tableName: string) => {
    dispatch("manage", { tableName });
  };

  const navigateBack = () => {
    goto(`/app/schemas?${$page.url.searchParams.toString()}`);
  };
</script>

<div class="max-w-6xl mx-auto p-6 bg-background rounded-lg shadow-md">
  <div class="flex items-center mb-6">
    <button on:click={navigateBack}>
      <Icon icon="ep:back" height="25" width="25" />
    </button>
    <h2 class="text-2xl font-semibold text-text ml-3">
      Tables in <span class="text-primary"><i>{schemaName}</i></span> Schema
    </h2>
  </div>

  <input
    type="text"
    placeholder="Search tables..."
    bind:value={searchTerm}
    class="w-full p-2 mb-6 border border-background-dark rounded-md bg-background-light text-text"
  />

  {#if filteredTables.length === 0}
    <p class="text-text-muted" transition:fade>
      No tables found in this schema.
    </p>
  {:else}
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {#each filteredTables as table, i (table.name)}
        <div
          class="bg-background-light rounded-lg shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden"
          transition:fly={{
            y: 50,
            duration: 300,
            delay: Math.min(i * 10, 100),
          }}
        >
          <div class="p-4">
            <h3 class="text-lg font-medium text-text mb-2 truncate" title={table.name}>{table.name}</h3>
            <div class="flex items-center justify-between mb-3">
              <span
                class="text-sm font-semibold {table.rlsEnabled
                  ? 'text-success'
                  : 'text-error'}"
              >
                RLS {table.rlsEnabled ? "Enabled" : "Disabled"}
              </span>
              {#if table.rlsEnabled}
                <span
                  class="text-xs font-semibold text-primary bg-primary bg-opacity-10 px-2 py-1 rounded-full"
                >
                  {table.rlsPoliciesCount}
                  {table.rlsPoliciesCount === 1 ? "policy" : "policies"}
                </span>
              {/if}
            </div>
            <Button
              on:click={() => dispatchManageRlsClickEvent(table.name)}
              fullWidth
            >
              Manage Policies
            </Button>
          </div>
        </div>
      {/each}
    </div>
  {/if}
</div>
