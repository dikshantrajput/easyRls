import initializePostgresManager from "$lib/managers/postgres.manager";
import RlsManager from "$lib/managers/rls.manager";
import { error, type ServerLoad } from "@sveltejs/kit";

export const load: ServerLoad = async ({ parent, params, depends }) => {
  depends("policies:fetch")
  const data = await parent();
  const { dbUrl } = data;
  const schemaName = params.schema_name;
  const tableName = params.table_name;
  if (!dbUrl || !schemaName || !tableName) throw error(500, "Schema not valid");
  const postgresManager = await initializePostgresManager(dbUrl);
  const tableManager = new RlsManager(postgresManager, {
    schemaName,
    tableName,
  });
  const policies = await tableManager.getAllPolicies();
  return { policies, schemaName, tableName };
};
