import TableManager from '$lib/managers/table.manager.js';
import { error, json } from '@sveltejs/kit';
import initializePostgresManager from "$lib/managers/postgres.manager";

export async function POST({ request }) {
	const { schemaName, tableName, dbUrl } = await request.json();
  const postgresManager = await initializePostgresManager(dbUrl);
  const tableManager = new TableManager(postgresManager, {
    schemaName: schemaName
  });
  try{
    const result = await tableManager.enableRls(tableName)
    return json({ result }, { status: 200 });
  }catch(err){
    throw error(500, String(err))
  }
}
