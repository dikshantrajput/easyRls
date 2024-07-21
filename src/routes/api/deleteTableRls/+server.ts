import { error, json } from '@sveltejs/kit';
import initializePostgresManager from "$lib/managers/postgres.manager";
import RlsManager from '$lib/managers/rls.manager.js';

export async function POST({ request }) {
	const { schemaName, tableName, dbUrl, policyName } = await request.json();
  const postgresManager = await initializePostgresManager(dbUrl);
  const rlsManager = new RlsManager(postgresManager, {
    schemaName,
    tableName
  });
  try{
    const result = await rlsManager.deletePolicy(policyName)
    return json({ result }, { status: 200 });
  }catch(err){
    throw error(500, String(err))
  }
}
