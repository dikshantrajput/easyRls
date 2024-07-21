<script lang="ts">
  import { enhance } from "$app/forms";
  import { goto } from "$app/navigation";
  import ConnectionStringInput from "$lib/components/ConnectionStringInput.svelte";
  import { dbConnectionStringStore } from "$lib/stores/db";
  import type { SubmitFunction } from "@sveltejs/kit";
  import { toast } from "svelte-sonner";

  let isLoading = false;

  const handleDatabaseConnection: SubmitFunction = () => {
    return async ({ result }) => {
      if (result.type === "success") {
        toast.success("Connection successful");
        dbConnectionStringStore.set(result?.data?.url as string);
        goto(`/schemas?db-url=${encodeURIComponent(result?.data?.url)}`);
      } else if (result.type === "error") {
        toast.error(result.error.message);
      }
    };
  };
</script>

<div class="max-w-2xl mx-auto p-6">
  <h1 class="text-3xl font-bold text-text mb-6">EasyRLS Database Connection</h1>
  <form method="post" action="" use:enhance={handleDatabaseConnection}>
    <ConnectionStringInput showButtonLoader={isLoading} />
  </form>
</div>

<!-- <TableList schemaName="onbo" tables={schemaTables} />

<PolicyManager /> -->
