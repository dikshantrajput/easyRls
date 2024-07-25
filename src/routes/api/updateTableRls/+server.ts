import { error, json } from "@sveltejs/kit";
import initializePostgresManager from "$lib/managers/postgres.manager";
import RlsManager, {
  type UpdatePolicyPayload,
} from "$lib/managers/rls.manager.js";

export async function POST({ request }) {
  const { schemaName, tableName, dbUrl, payload } = await request.json();
  const postgresManager = await initializePostgresManager(dbUrl);
  const rlsManager = new RlsManager(postgresManager, {
    schemaName,
    tableName,
  });
  try {
    const updatePayload: UpdatePolicyPayload = {
      name: payload?.name,
      using: payload?.using,
      withCheck: payload?.withCheck,
    };
    const result = await rlsManager.updatePolicy(updatePayload);
    return json({ result }, { status: 200 });
  } catch (err) {
    throw error(500, String(err));
  }
}
