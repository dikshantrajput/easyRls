import initializePostgresManager from "$lib/managers/postgres.manager";
import TableManager from "$lib/managers/table.manager";
import { error, type ServerLoad } from "@sveltejs/kit";

export const load: ServerLoad = async ({ parent, params, depends }) => {
  depends("tables:fetch");
  const data = await parent();
  const { dbUrl } = data;
  const schemaName = params.schema_name;
  if (!dbUrl || !schemaName) throw error(500, "Schema not valid");
  const postgresManager = await initializePostgresManager(dbUrl);
  const tableManager = new TableManager(postgresManager, {
    schemaName,
  });
  const tables = await tableManager.getAllTables();
  return { tables, schemaName };
};
