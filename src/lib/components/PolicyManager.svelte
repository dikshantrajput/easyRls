<script lang="ts">
  import { fade, fly } from "svelte/transition";
  import { quintOut } from "svelte/easing";
  import type { RlsPolicyInterface } from "$lib/managers/rls.manager";
  import AlertPopup from "./AlertPopup.svelte";
  import { createEventDispatcher } from "svelte";
  import Button from "./Button.svelte";

  export let policies: RlsPolicyInterface[] = [],
    tableName: string,
    schemaName: string;

  let searchTerm = "";
  let editingPolicy: RlsPolicyInterface | null = null;
  let showEditPanel = false;
  let alertPopupComponent: AlertPopup;

  const dispatch = createEventDispatcher<{
    delete: { id: string };
  }>();

  $: filteredPolicies = policies.filter(
    (policy) =>
      policy.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      policy.roles.includes(searchTerm.toLowerCase()),
  );

  function addNewPolicy() {
    editingPolicy = {
      id: "",
      name: "",
      type: "permissive",
      roles: "",
      crud: [],
      using: "",
      withCheck: "",
    };
    showEditPanel = true;
  }

  function editPolicy(policy: RlsPolicyInterface) {
    editingPolicy = { ...policy };
    showEditPanel = true;
  }

  function closeEditPanel() {
    showEditPanel = false;
    editingPolicy = null;
  }

  function savePolicy() {
    // Implement save logic here
    console.log("Saving policy:", editingPolicy);
    closeEditPanel();
  }

  async function deletePolicy(id: string) {
    const isConfirmed = await alertPopupComponent.confirmPopupOperation();
    if (isConfirmed) {
      dispatch("delete", { id });
    }
  }

  function toggleAllCrud() {
    if (editingPolicy) {
      editingPolicy.crud = editingPolicy.crud.includes("ALL") ? [] : ["ALL"];
    }
  }
</script>

<div class="p-6 bg-background">
  <div class="flex justify-between items-center mb-6">
    <h2 class="text-2xl font-semibold text-text mb-6">
      RLS Policies in <span class="text-primary"
        ><i>{schemaName}.{tableName}</i></span
      >
    </h2>

    <Button on:click={addNewPolicy}>Add New Policy</Button>
  </div>

  <input
    type="text"
    placeholder="Search policies..."
    bind:value={searchTerm}
    class="w-full p-2 mb-6 border border-background-dark rounded-md bg-background-light text-text"
  />

  {#if filteredPolicies.length === 0}
    <p class="text-text-muted" transition:fade>
      No tables found in this schema.
    </p>
  {:else}
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {#each filteredPolicies as policy, i (policy.id)}
        <div
          class="bg-background-light rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
          transition:fly={{
            y: 50,
            duration: 300,
            delay: Math.min(i * 10, 100),
          }}
        >
          <h2 class="text-xl font-semibold text-text mb-2">{policy.name}</h2>
          <p class="text-text-muted mb-1">
            Type: <span class="font-medium">{policy.type}</span>
          </p>
          <p class="text-text-muted mb-1">
            Role: <span class="font-medium">{policy.roles}</span>
          </p>
          <p class="text-text-muted mb-4">
            CRUD: <span class="font-medium">{policy.crud}</span>
          </p>
          <div class="flex justify-end">
            <button
              on:click={() => editPolicy(policy)}
              class="text-secondary hover:text-secondary-dark transition-colors mr-4"
            >
              Edit
            </button>
            <button
              on:click={() => deletePolicy(policy.id)}
              class="text-error hover:text-red-700 transition-colors"
            >
              Delete
            </button>
          </div>
        </div>
      {/each}
    </div>
  {/if}
</div>

{#if showEditPanel}
  <div
    class="fixed inset-y-0 right-0 w-full md:w-1/2 lg:w-1/3 bg-background-light shadow-lg p-6 overflow-y-auto"
    transition:fly={{ x: 300, duration: 300, easing: quintOut }}
  >
    <h2 class="text-2xl font-bold mb-6">
      {editingPolicy.id ? "Edit" : "Add"} Policy
    </h2>
    <form on:submit|preventDefault={savePolicy}>
      <div class="mb-4">
        <label for="name" class="block text-text-muted mb-2">Name</label>
        <input
          id="name"
          type="text"
          bind:value={editingPolicy.name}
          class="w-full p-2 border border-background-dark rounded-md bg-background text-text"
        />
      </div>

      <div class="mb-4">
        <label class="block text-text-muted mb-2">Type</label>
        <div class="flex">
          <label class="mr-4">
            <input
              type="radio"
              bind:group={editingPolicy.type}
              value="permissive"
            /> Permissive
          </label>
          <label>
            <input
              type="radio"
              bind:group={editingPolicy.type}
              value="restrictive"
            /> Restrictive
          </label>
        </div>
      </div>

      <div class="mb-4">
        <label for="role" class="block text-text-muted mb-2">Role</label>
        <input
          id="role"
          type="text"
          bind:value={editingPolicy.role}
          class="w-full p-2 border border-background-dark rounded-md bg-background text-text"
        />
      </div>

      <div class="mb-4">
        <label class="block text-text-muted mb-2">CRUD Operations</label>
        <div class="flex flex-wrap items-center">
          <label class="flex items-center mr-4 mb-2">
            <input
              type="checkbox"
              on:change={toggleAllCrud}
              checked={editingPolicy.crud.includes("ALL")}
              class="mr-2"
            /> ALL
          </label>
          {#each ["SELECT", "INSERT", "UPDATE", "DELETE"] as operation}
            <label class="flex items-center mr-4 mb-2">
              <input
                type="checkbox"
                bind:group={editingPolicy.crud}
                value={operation}
                disabled={editingPolicy.crud.includes("ALL")}
                class="mr-2"
              />
              {operation}
            </label>
          {/each}
        </div>
      </div>

      <div class="mb-4">
        <label for="using" class="block text-text-muted mb-2"
          >USING Expression</label
        >
        <textarea
          id="using"
          bind:value={editingPolicy.using}
          rows="3"
          class="w-full p-2 border border-background-dark rounded-md bg-background text-text"
          placeholder="Enter USING expression here"
        ></textarea>
      </div>

      <div class="mb-6">
        <label class="flex items-center">
          <input
            type="checkbox"
            class="mr-2"
            bind:checked={editingPolicy.withCheck}
          />
          <span class="text-text-muted">Add WITH CHECK expression</span>
        </label>
        {#if editingPolicy.withCheck !== ""}
          <textarea
            bind:value={editingPolicy.withCheck}
            rows="3"
            class="w-full p-2 mt-2 border border-background-dark rounded-md bg-background text-text"
            placeholder="Enter WITH CHECK expression here"
          ></textarea>
        {/if}
      </div>

      <div class="flex justify-end">
        <button
          type="button"
          on:click={closeEditPanel}
          class="px-4 py-2 bg-background-dark text-text rounded-md hover:bg-background transition-colors mr-4"
        >
          Cancel
        </button>
        <button
          type="submit"
          class="px-4 py-2 bg-primary text-background rounded-md hover:bg-primary-dark transition-colors"
        >
          Save
        </button>
      </div>
    </form>
  </div>
{/if}

<AlertPopup
  title="Delete Confirmation"
  message="Are you sure you want to delete this policy? This action cannot be undone."
  cancelText="Cancel"
  confirmText="Delete"
  bind:this={alertPopupComponent}
/>
