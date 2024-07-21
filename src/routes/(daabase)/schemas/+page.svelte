<script lang="ts">
  import { goto } from "$app/navigation";
  import SchemaList from "$lib/components/SchemaList.svelte";
  import type { PageData } from "./$types";

  export let data: PageData;

  const { schemas, dbUrl } = data;

  const handleViewSchemaTableClick = (event: CustomEvent<string>) => {
    const schemaName = event.detail;
    goto(`schemas/${schemaName}/tables?db-url=${encodeURIComponent(dbUrl)}`);
  };
</script>

<div class="max-w-6xl mx-auto p-6">
  <SchemaList {schemas} on:viewTable={handleViewSchemaTableClick} />
</div>
