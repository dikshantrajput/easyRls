<script lang="ts">
  import { fade, fly } from "svelte/transition";
  import { quintOut } from "svelte/easing";
  import type { RlsPolicyInterface } from "$lib/managers/rls.manager";
  import AlertPopup from "./AlertPopup.svelte";
  import { createEventDispatcher } from "svelte";
  import Button from "./Button.svelte";
  import type { DatabaseRoleInterface } from "$lib/managers/database.manager";

  interface EditingPolicyInterface extends RlsPolicyInterface {
    withCheckEnabled: boolean;
    action: "CREATE" | "EDIT";
  }

  export let policies: RlsPolicyInterface[] = [];
  export let tableName: string;
  export let tableRlsEnabled: boolean;
  export let schemaName: string;
  export let dbRoles: DatabaseRoleInterface[];

  let searchTerm = "";
  let editingPolicy: EditingPolicyInterface | null = null;
  let showEditPanel = false;
  let alertPopupComponent: AlertPopup;
  let errors: Record<string, string> = {};

  const dispatch = createEventDispatcher<{
    action: {
      type: "delete" | "disable" | "enable" | "create" | "edit";
      data?: {
        id?: string;
        createPayload?: RlsPolicyInterface;
        updatePayload?: RlsPolicyInterface;
      };
    };
  }>();

  $: filteredPolicies = policies.filter(
    (policy) =>
      policy.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      policy.roles.some((role) =>
        role.toLowerCase().includes(searchTerm.toLowerCase()),
      ),
  );

  function addNewPolicy() {
    editingPolicy = {
      id: "",
      name: "",
      type: "PERMISSIVE",
      roles: [],
      crud: "SELECT",
      using: "",
      withCheck: "",
      withCheckEnabled: false,
      action: "CREATE",
    };
    showEditPanel = true;
  }

  function disableRlsPolicy() {
    dispatch("action", { type: "disable" });
  }

  function enableRlsPolicy() {
    dispatch("action", { type: "enable" });
  }

  function editPolicy(policy: RlsPolicyInterface) {
    editingPolicy = structuredClone({
      ...policy,
      roles: [...policy.roles],
      withCheckEnabled: !!policy.withCheck,
      action: "EDIT",
    });
    showEditPanel = true;
  }

  export function closeEditPanel() {
    showEditPanel = false;
    editingPolicy = null;
    errors = {};
  }

  function validatePolicy(): boolean {
    if (!editingPolicy) return false;
    errors = {};

    if (!editingPolicy.name.trim()) {
      errors.name = "Name is required";
    }

    if (editingPolicy.roles.length === 0) {
      errors.roles = "At least one role must be selected";
    }

    if (!editingPolicy.crud) {
      errors.crud = "CRUD operation must be selected";
    }

    if (editingPolicy.crud === "INSERT") {
      if (!editingPolicy?.withCheck?.trim()) {
        errors.withCheck =
          "WITH CHECK expression is required for INSERT operation";
      }
    } else if (!editingPolicy.using.trim()) {
      errors.using = "USING expression is required";
    }

    return Object.keys(errors).length === 0;
  }

  function savePolicy() {
    if (validatePolicy() && editingPolicy) {
      if (!editingPolicy.withCheckEnabled) {
        editingPolicy.withCheck = "";
      }

      if (editingPolicy.action === "CREATE") {
        dispatch("action", {
          type: "create",
          data: { createPayload: editingPolicy },
        });
      } else {
        dispatch("action", {
          type: "edit",
          data: { updatePayload: editingPolicy },
        });
      }
    }
  }

  async function deletePolicy(id: string) {
    const isConfirmed = await alertPopupComponent.confirmPopupOperation();
    if (isConfirmed) {
      dispatch("action", { type: "delete", data: { id } });
    }
  }

  function toggleRole(role: string) {
    if (editingPolicy) {
      editingPolicy.roles = editingPolicy.roles.includes(role)
        ? editingPolicy.roles.filter((r) => r !== role)
        : [...editingPolicy.roles, role];
    }
  }

  let isInsertSelected = false,
    shouldWithCheckBlockVisible = false;

  $: if (editingPolicy?.crud) {
    if (editingPolicy?.crud === "INSERT") {
      isInsertSelected = true;
      shouldWithCheckBlockVisible = false;
      editingPolicy.withCheckEnabled = true;
    } else if (
      editingPolicy?.crud !== "SELECT" &&
      editingPolicy?.crud !== "DELETE"
    ) {
      shouldWithCheckBlockVisible = true;
      isInsertSelected = false;
    } else {
      shouldWithCheckBlockVisible = false;
      isInsertSelected = false;
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

    <div class="flex gap-2">
      <Button on:click={addNewPolicy}>Add New Policy</Button>
      {#if tableRlsEnabled}
        <Button variant="accent" on:click={disableRlsPolicy}>Disable RLS</Button
        >
      {:else}
        <Button variant="secondary" on:click={enableRlsPolicy}
          >Enable RLS</Button
        >
      {/if}
    </div>
  </div>

  <input
    type="text"
    placeholder="Search policies..."
    bind:value={searchTerm}
    class="w-full p-2 mb-6 border border-background-dark rounded-md bg-background-light text-text"
  />

  {#if filteredPolicies.length === 0}
    <p class="text-text-muted" transition:fade>
      No policies found for this table.
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
            Roles: <span class="font-medium">{policy.roles.join(", ")}</span>
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

{#if showEditPanel && editingPolicy}
  <div
    class="fixed inset-y-0 right-0 w-full md:w-1/2 lg:w-1/3 bg-background-light shadow-lg p-6 overflow-y-auto"
    transition:fly={{ x: 300, duration: 300, easing: quintOut }}
  >
    <h2 class="text-2xl font-bold mb-6">
      {editingPolicy.action == "EDIT" ? "Edit" : "Add"} Policy
    </h2>
    <form on:submit|preventDefault={savePolicy} class="space-y-4">
      <div>
        <label for="name" class="block text-text-muted mb-2">Name*</label>
        <input
          id="name"
          type="text"
          bind:value={editingPolicy.name}
          class="w-full p-2 border border-background-dark rounded-md bg-background text-text disabled:text-gray-400"
          required
          disabled={editingPolicy.action === "EDIT"}
        />
        {#if errors.name}
          <p class="text-error text-sm mt-1">{errors.name}</p>
        {/if}
      </div>

      <div>
        <label for="type" class="block text-text-muted mb-2">Type*</label>
        <div class="flex space-x-4">
          <label class="inline-flex items-center">
            <input
              id="type"
              type="radio"
              bind:group={editingPolicy.type}
              value="PERMISSIVE"
              class="form-radio text-primary"
              required
              disabled={editingPolicy.action === "EDIT"}
            />
            <span class="ml-2">Permissive</span>
          </label>
          <label class="inline-flex items-center">
            <input
              type="radio"
              bind:group={editingPolicy.type}
              value="RESTRICTIVE"
              class="form-radio text-primary"
              required
              disabled={editingPolicy.action === "EDIT"}
            />
            <span class="ml-2">Restrictive</span>
          </label>
        </div>
      </div>

      <div>
        <label for="roles" class="block text-text-muted mb-2">Roles*</label>
        <div
          class="max-h-40 overflow-y-auto border border-background-dark rounded-md p-2"
        >
          {#each dbRoles as role}
            <label class="inline-flex items-center mb-2 mr-4">
              <input
                id="roles"
                type="checkbox"
                checked={editingPolicy?.roles?.includes(role.name)}
                on:change={() => toggleRole(role.name)}
                class="form-checkbox text-primary"
                disabled={editingPolicy.action === "EDIT"}
              />
              <span class="ml-2">{role.name}</span>
            </label>
          {/each}
        </div>
        {#if errors.roles}
          <p class="text-error text-sm mt-1">{errors.roles}</p>
        {/if}
      </div>

      <div>
        <label for="crud" class="block text-text-muted mb-2"
          >CRUD Operations*</label
        >
        <div class="flex flex-wrap items-center space-x-4">
          {#each ["ALL", "SELECT", "INSERT", "UPDATE", "DELETE"] as operation}
            <label class="inline-flex items-center">
              <input
                id="crud"
                bind:group={editingPolicy.crud}
                value={operation}
                type="radio"
                class="form-checkbox text-primary"
                disabled={editingPolicy.action === "EDIT"}
              />
              <span class="ml-2">{operation}</span>
            </label>
          {/each}
        </div>
        {#if errors.crud}
          <p class="text-error text-sm mt-1">{errors.crud}</p>
        {/if}
      </div>

      {#if isInsertSelected}
        <div>
          <label for="withCheck" class="block text-text-muted mb-2"
            >WITH CHECK Expression*</label
          >
          <textarea
            id="withCheck"
            bind:value={editingPolicy.withCheck}
            rows="3"
            class="w-full p-2 border border-background-dark rounded-md bg-background text-text"
            placeholder="Enter WITH CHECK expression here"
            required
          ></textarea>
          {#if errors.withCheck}
            <p class="text-error text-sm mt-1">{errors.withCheck}</p>
          {/if}
        </div>
      {:else}
        <div>
          <label for="using" class="block text-text-muted mb-2"
            >USING Expression*</label
          >
          <textarea
            id="using"
            bind:value={editingPolicy.using}
            rows="3"
            class="w-full p-2 border border-background-dark rounded-md bg-background text-text"
            placeholder="Enter USING expression here"
            required
          ></textarea>
          {#if errors.using}
            <p class="text-error text-sm mt-1">{errors.using}</p>
          {/if}
        </div>

        {#if shouldWithCheckBlockVisible}
          <div>
            <label class="inline-flex items-center">
              <input
                type="checkbox"
                class="form-checkbox text-primary"
                bind:checked={editingPolicy.withCheckEnabled}
                on:change={(event) => {
                  if (!editingPolicy?.withCheckEnabled) {
                    if (editingPolicy?.action === "EDIT") {
                      editingPolicy.withCheckEnabled = true;
                      alert(
                        "With check expression can not be removed once added. please delete and recreated the policy",
                      );
                    }
                  }
                }}
              />
              <span class="ml-2 text-text-muted">Add WITH CHECK expression</span
              >
            </label>
            {#if editingPolicy.withCheckEnabled}
              <textarea
                bind:value={editingPolicy.withCheck}
                rows="3"
                class="w-full p-2 mt-2 border border-background-dark rounded-md bg-background text-text"
                placeholder="Enter WITH CHECK expression here"
                required={editingPolicy.withCheckEnabled}
              ></textarea>
              {#if errors.withCheck}
                <p class="text-error text-sm mt-1">{errors.withCheck}</p>
              {/if}
            {/if}
          </div>
        {/if}
      {/if}

      <div class="flex justify-end space-x-4">
        <button
          type="button"
          on:click={closeEditPanel}
          class="px-4 py-2 bg-background-dark text-text rounded-md hover:bg-background transition-colors"
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
