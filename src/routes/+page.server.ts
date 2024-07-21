import initializePostgresManager from "$lib/managers/postgres.manager";
import PostgresManager from "$lib/managers/postgres.manager";
import RlsManager from "$lib/managers/rls.manager";
import SchemaManager from "$lib/managers/schema.manager";
import TableManager from "$lib/managers/table.manager";
import { dbConnectionStringStore } from "$lib/stores/db";
import { type Actions, error, type ServerLoad } from "@sveltejs/kit";
import { get } from "svelte/store";

export const load: ServerLoad = async () => {
  // const conString = get(dbConnectionStringStore);
  // if (!conString) throw error(500, "Connection string not given");
  // const postgresManager = await PostgresManager.initialize(conString);
  // if (!postgresManager.error) {
  // const rlsManager = new RlsManager(postgresManager.data[0], {
  //   schemaName: "onbo",
  //   tableName: "orgs",
  // });
  // // if(!postgresManager.error){
  // //   console.log(await postgresManager.data[0].query("select * from onbo.orgs;"));
  // // }else{
  // //   throw error(500, postgresManager.error)
  // // }

  // if (!rlsManager.error) {
  //   console.log(await rlsManager.getAllPolicies());
  // } else {
  //   throw error(500, rlsManager.error);
  // }

  // const schemaManager = new SchemaManager(postgresManager.data[0]);

  // if (!schemaManager.error) {
  //   console.log(await schemaManager.createSchema("onbo"));
  // } else {
  //   throw error(500, schemaManager.error);
  // }

  // const tableManager = new TableManager(postgresManager.data[0], {
  //   schemaName: 'onbo'
  // });

  // if (!tableManager.error) {
  //   console.log(await tableManager.getAllTables());
  // } else {
  //   throw error(500, tableManager.error);
  // }
  // }else{
  //     throw error(500, postgresManager.error);
  // }
};

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
