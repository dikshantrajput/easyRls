import initializePostgresManager from "$lib/managers/postgres.manager";
import { type Actions, error } from "@sveltejs/kit";

export const actions: Actions = {
  default: async ({ request }) => {
    const formData = await request.formData();
    const url = formData.get("url");
    try {
      await initializePostgresManager(url as string);
    } catch (err) {
      throw error(500, String(err));
    }
    return { url };
  },
};
