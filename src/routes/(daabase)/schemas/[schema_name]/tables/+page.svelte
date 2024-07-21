<script lang="ts">
  import SchemaList from "$lib/components/SchemaList.svelte";
  import TableList from "$lib/components/TableList.svelte";
  import { toast } from "svelte-sonner";
  import { goto, invalidate } from "$app/navigation";
  import type { PageData } from "./$types";

  export let data: PageData;

  $: ({ tables, schemaName, dbUrl } = data);

  const manageTableRls = (tableName: string) => {
    goto(
      `/schemas/${schemaName}/tables/${tableName}?db-url=${encodeURIComponent(dbUrl)}`,
    );
  };

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
      invalidate("tables:fetch");
    } else {
      toast.error(
        String(data.message ?? `Error enabling RLS for table ${tableName}`),
      );
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
        manageTableRls(tableName);
        break;
      default:
        console.error("Action not define");
    }
  };
</script>

<div class="max-w-6xl mx-auto p-6">
  <TableList {schemaName} {tables} on:action={handleActionClick} />
</div>
