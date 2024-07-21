<script lang="ts">
  import PolicyManager from "$lib/components/PolicyManager.svelte";
  import SchemaList from "$lib/components/SchemaList.svelte";
  import TableList from "$lib/components/TableList.svelte";
  import type { PageData } from "../$types";

  export let data: PageData;

  $: ({ policies, tableName, schemaName, dbUrl } = data);

  const manageTableRls = (tableName: string) => {
    console.log(tableName);
  };

  const enableRlsOnTable = async (tableName: string) => {
    const res = await fetch("/api/enableTableRls", {
      method: "POST",
      body: JSON.stringify({
        schemaName,
        tableName,
        dbUrl,
      }),
    });

    console.log(await res.json());
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
  <PolicyManager {policies} />
</div>
