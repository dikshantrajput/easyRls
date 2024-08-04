<script lang="ts">
  import TableList from "$lib/components/TableList.svelte";
  import { goto } from "$app/navigation";
  import type { PageData } from "./$types";

  export let data: PageData;

  $: ({ tables, schemaName, dbUrl } = data);

  const manageTableRls = (tableName: string) => {
    goto(
      `/app/schemas/${schemaName}/tables/${tableName}?db-url=${encodeURIComponent(dbUrl)}`,
    );
  };

  const handleActionClick = (
    event: CustomEvent<{ tableName: string }>,
  ) => {
    const {tableName} = event.detail
    manageTableRls(tableName);
  };
</script>

<svelte:head>
  <title>
    EasyRLS | All Tables
  </title>
</svelte:head>

<div class="max-w-6xl mx-auto p-6">
  <TableList {schemaName} {tables} on:manage={handleActionClick} />
</div>
