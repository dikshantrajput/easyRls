import type { PostgresManagerInterface } from "./postgres.manager";

export interface DatabaseSchemaInterface {
  name: string;
  tableCount: number;
}

interface DatabaseSchemaResponseInterface {
  schema_name: string;
  table_count: number;
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
     SELECT
          n.nspname AS schema_name,
          COUNT(t.relname) AS table_count
      FROM
          pg_namespace n
      LEFT JOIN
          pg_class t ON t.relnamespace = n.oid AND t.relkind = 'r'
      WHERE
          n.nspname NOT LIKE 'pg_%'
          AND n.nspname != 'information_schema'
      GROUP BY
          n.nspname
      ORDER BY
          n.nspname;
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
    const { data, error } = await this.pgManager.query<
      DatabaseSchemaResponseInterface
    >(
      this.generateGetAllSchemasQuery(),
    );
    if (!error && data) {
      return data?.map((schema) => ({
        name: schema.schema_name,
        tableCount: schema.table_count,
      }));
    }

    throw new Error(error);
  }
}
