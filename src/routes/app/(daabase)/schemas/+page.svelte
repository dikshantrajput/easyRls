<script lang="ts">
  import { goto } from "$app/navigation";
  import SchemaList from "$lib/components/SchemaList.svelte";
  import type { PageData } from "./$types";

  export let data: PageData;

  const { schemas, dbUrl } = data;

  function getDbNameFromUrl(url: string) {
    try {
      const splittedUrl = url.split("/");
      const dbName = splittedUrl[splittedUrl.length - 1];
      return dbName || null;
    } catch (error) {
      console.error("Invalid connection URL:", error?.message);
      return null;
    }
  }

  const handleViewSchemaTableClick = (event: CustomEvent<string>) => {
    const schemaName = event.detail;
    goto(`schemas/${schemaName}/tables?db-url=${encodeURIComponent(dbUrl)}`);
  };
</script>

<svelte:head>
  <title>
    EasyRLS | All schemas
  </title>
</svelte:head>

<div class="max-w-6xl mx-auto p-6">
  <SchemaList
    {schemas}
    on:viewTable={handleViewSchemaTableClick}
    dbName={getDbNameFromUrl(dbUrl)}
  />
</div>
