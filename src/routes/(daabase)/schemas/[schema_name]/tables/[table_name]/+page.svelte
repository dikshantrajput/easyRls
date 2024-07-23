<script lang="ts">
  import PolicyManager from "$lib/components/PolicyManager.svelte";
  import { toast } from "svelte-sonner";
  import type { PageData } from "../$types";
  import { invalidate } from "$app/navigation";

  export let data: PageData;

  $: ({ policies, tableName, schemaName, dbUrl, isRlsEnabledOnTable } = data);

  const enableRlsOnTable = async (tableName: string) => {
    toast.loading(`Enabling RLS for table ${tableName}`);
    const res = await fetch("/api/enableTableRls", {
      method: "POST",
      body: JSON.stringify({
        schemaName,
        tableName,
        dbUrl,
      }),
    });
    const data = await res.json();
    if (res.ok && data.result) {
      toast.success(`RLS Enabled for table ${tableName}`);
      invalidate("policies:fetch");
    } else {
      toast.error(
        String(data.message ?? `Error enabling RLS for table ${tableName}`),
      );
    }
  };

  const handleDeleteRlsPolicyEvent = (id: string) => {
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

  const disableRlsOnTable = async (policyName: string) => {
    toast.loading(`Disabling RLS policy for table: ${tableName}`);
    const res = await fetch("/api/disableTableRls", {
      method: "POST",
      body: JSON.stringify({
        schemaName,
        tableName,
        dbUrl,
      }),
    });
    const data = await res.json();

    if (res.ok && data.result) {
      toast.success(`${tableName} rls disabled`);
      invalidate("policies:fetch");
    } else {
      toast.error(
        String(data.message ?? `Error disabling rls for table: ${tableName}`),
      );
    }
  };

  const handleActionClick = (
    event: CustomEvent<{
      type: "delete" | "disable" | "enable";
      data?: {
        id?: string;
      };
    }>,
  ) => {
    const { type, data } = event.detail;

    switch (type) {
      case "enable":
        enableRlsOnTable(tableName);
        break;
      case "disable":
        disableRlsOnTable(tableName);
        break;
      case "delete":
        if (!data?.id) throw Error("Invalid action data");
        handleDeleteRlsPolicyEvent(data.id);
        break;
      default:
        console.error("Action not define");
    }
  };
</script>

<div class="max-w-6xl mx-auto p-6">
  <PolicyManager
    tableRlsEnabled={isRlsEnabledOnTable}
    {policies}
    {schemaName}
    {tableName}
    on:action={handleActionClick}
  />
</div>
