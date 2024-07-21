import initializePostgresManager from "$lib/managers/postgres.manager";
import SchemaManager from "$lib/managers/schema.manager";
import { error, type ServerLoad } from "@sveltejs/kit";

export const load: ServerLoad = async ({ parent }) => {
  const data = await parent();
  const { dbUrl } = data;
  if (!dbUrl) throw error(500, "Connection string not given");
  const postgresManager = await initializePostgresManager(dbUrl);
  const schemaManager = new SchemaManager(postgresManager);
  const schemas = await schemaManager.getAllSchemas();
  return { schemas };
};
