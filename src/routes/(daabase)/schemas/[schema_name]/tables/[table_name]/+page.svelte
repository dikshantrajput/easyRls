<script lang="ts">
  import PolicyManager from "$lib/components/PolicyManager.svelte";
  import SchemaList from "$lib/components/SchemaList.svelte";
  import TableList from "$lib/components/TableList.svelte";
  import { toast } from "svelte-sonner";
  import type { PageData } from "../$types";
  import { invalidate } from "$app/navigation";

  export let data: PageData;

  $: ({ policies, tableName, schemaName, dbUrl } = data);

  const enableRlsOnTable = async (tableName: string) => {
    const res = await fetch("/api/enableTableRls", {
      method: "POST",
      body: JSON.stringify({
        schemaName,
        tableName,
        dbUrl,
      }),
    });
  };

  const handleDeleteRlsPolicyEvent = (event: CustomEvent<{ id: string }>) => {
    const id = event.detail.id;
    const policyToDelete = policies.find((policy) => policy.id === id);
    if (!policyToDelete) {
      toast.error("Policy to delete not found");
      return;
    }
    deleteRlsPolicy(policyToDelete.name);
  };

  const deleteRlsPolicy = async (policyName: string) => {
    toast.loading(`Deleting RLS policy ${policyName}`);
    const res = await fetch("/api/deleteTableRls", {
      method: "POST",
      body: JSON.stringify({
        schemaName,
        tableName,
        dbUrl,
        policyName,
      }),
    });
    const data = await res.json();
    
    if (res.ok && data.result) {
      toast.success(`${policyName} deleted`);
      invalidate("policies:fetch");
    } else {
      toast.error(String(data.message ?? `Error deleting ${policyName}`));
    }
  };

  const handleActionClick = (
    event: CustomEvent<{ action: "manage" | "enable"; tableName: string }>,
  ) => {
    const { action, tableName } = event.detail;

    switch (action) {
      case "enable":
        enableRlsOnTable(tableName);
        break;
      case "manage":
        break;
      default:
        console.error("Action not define");
    }
  };
</script>

<div class="max-w-6xl mx-auto p-6">
  <PolicyManager {policies} on:delete={handleDeleteRlsPolicyEvent} {schemaName} {tableName} />
</div>
