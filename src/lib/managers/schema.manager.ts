import type { PostgresManagerInterface } from "./postgres.manager";

export interface DatabaseSchemaInterface {
  name: string;
  tableCount: number
}

interface DatabaseSchemaResponseInterface {
  table_schema: string;
  table_count: number
}

interface SchemaManagerInterface {
  createSchema(name: string): Promise<boolean>;
  getAllSchemas(): Promise<DatabaseSchemaInterface[]>;
}

export default class SchemaManager implements SchemaManagerInterface {
  private pgManager: PostgresManagerInterface;

  constructor(
    pgManager: PostgresManagerInterface,
  ) {
    this.pgManager = pgManager;
  }

  private generateCreateSchemasQuery(schemaName: string) {
    return `
      CREATE SCHEMA ${schemaName};
    `;
  }

  private generateGetAllSchemasQuery() {
    return `
      SELECT table_schema, COUNT(*) as table_count
      FROM information_schema.tables 
      WHERE table_schema NOT IN ('pg_catalog', 'information_schema')
      GROUP BY table_schema;;
    `;
  }

  async createSchema(name: string): Promise<boolean> {
    const { error } = await this.pgManager.query(
      this.generateCreateSchemasQuery(name),
    );

    if (!error) {
      return true;
    }

    throw new Error(error);
  }

  async getAllSchemas(): Promise<DatabaseSchemaInterface[]> {
    const { data, error } = await this.pgManager.query<DatabaseSchemaResponseInterface>(
      this.generateGetAllSchemasQuery(),
    );
    if (!error && data) {
      return data?.map((schema) => ({
        name: schema.table_schema,
        tableCount: schema.table_count
      }))
    }

    throw new Error(error);
  }

}


