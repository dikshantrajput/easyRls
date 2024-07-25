import DatabaseManager from "$lib/managers/database.manager";
import initializePostgresManager from "$lib/managers/postgres.manager";
import RlsManager from "$lib/managers/rls.manager";
import TableManager from "$lib/managers/table.manager";
import { error, type ServerLoad } from "@sveltejs/kit";

export const load: ServerLoad = async ({ parent, params, depends }) => {
  depends("policies:fetch");
  const data = await parent();
  const { dbUrl } = data;
  const schemaName = params.schema_name;
  const tableName = params.table_name;
  if (!dbUrl || !schemaName || !tableName) throw error(500, "Schema not valid");
  const postgresManager = await initializePostgresManager(dbUrl);
  const dbManager = new DatabaseManager(postgresManager);
  const tableManager = new TableManager(postgresManager, {
    schemaName,
  });
  const rlsManager = new RlsManager(postgresManager, {
    schemaName,
    tableName,
  });
  const policies = await rlsManager.getAllPolicies();
  const isRlsEnabledOnTable = await tableManager.isRlsEnabled(tableName);
  const dbRoles = await dbManager.getAllUserCreatedRoles();
  return { policies, schemaName, tableName, isRlsEnabledOnTable, dbRoles };
};
