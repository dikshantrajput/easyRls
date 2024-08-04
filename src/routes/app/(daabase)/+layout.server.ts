import { type ServerLoad } from "@sveltejs/kit";

export const load: ServerLoad = async ({url}) => {
  const searchParams = url.searchParams
  return {
    dbUrl: searchParams.get("db-url")
  }
};
