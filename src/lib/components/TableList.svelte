<script lang="ts">
  import type { DatabaseTableInterface } from "$lib/managers/table.manager";
    import { createEventDispatcher } from "svelte";
  import { fade, fly } from "svelte/transition";

  export let schemaName: string,
    tables: DatabaseTableInterface[] = [];

  const dispatch = createEventDispatcher<{
    action: {
      tableName: string;
      action: 'manage' | 'enable';
    };
  }>();

  const dispatchEnableOrManageRlsClickEvent = (action: 'manage' | 'enable', tableName: string) => {
    dispatch("action", {action, tableName});
  };
</script>

<div
  class="max-w-6xl mx-auto p-6 bg-background rounded-lg shadow-md"
>
  <h2 class="text-2xl font-semibold text-text mb-6">
    Tables in {schemaName} Schema
  </h2>

  {#if tables.length === 0}
    <p class="text-text-muted" transition:fade>
      No tables found in this schema.
    </p>
  {:else}
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {#each tables as table, i (table.name)}
        <div
          class="bg-background-light rounded-lg shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden"
          transition:fly={{ y: 50, duration: 300, delay: i * 50 }}
        >
          <div class="p-4">
            <h3 class="text-lg font-medium text-text mb-2">{table.name}</h3>
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
            <button
              class="w-full py-2 px-4 rounded-md text-sm font-medium transition-colors duration-200
              {table.rlsEnabled
                ? 'bg-secondary text-white hover:bg-secondary-dark'
                : 'bg-primary text-white hover:bg-primary-dark'}"
              on:click={() => dispatchEnableOrManageRlsClickEvent(table.rlsEnabled ? 'manage'  : 'enable' , table.name)}
            >
              {table.rlsEnabled ? "Manage Policies" : "Enable RLS"}
            </button>
          </div>
        </div>
      {/each}
    </div>
  {/if}
</div>
