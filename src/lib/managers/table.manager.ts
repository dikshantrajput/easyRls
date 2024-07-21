import type { PostgresManagerInterface } from "./postgres.manager";

export interface DatabaseTableInterface {
  name: string;
  rlsEnabled: boolean;
  rlsPoliciesCount: number;
}

interface DatabaseTableResponseInterface {
  table_name: string;
  rls_enabled: boolean;
  rls_policy_count: string;
}

interface TableManagerInterface {
  enableRls(tableName: string): Promise<boolean>;
  getAllTables(): Promise<DatabaseTableInterface[]>;
}

interface TableManagerOptionsInterface {
  schemaName: string;
}

export default class TableManager implements TableManagerInterface {
  private pgManager: PostgresManagerInterface;
  private options: TableManagerOptionsInterface;

  constructor(
    pgManager: PostgresManagerInterface,
    options: TableManagerOptionsInterface,
  ) {
    this.pgManager = pgManager;
    this.options = options;
  }

  private generateEnableRlsQuery(tableName: string) {
    return `ALTER TABLE ${this.options.schemaName}.${tableName} ENABLE ROW LEVEL SECURITY;`;
  }

  private generateGetAllTablesQuery() {
    return `
    SELECT
    t.relname AS table_name,
    t.relrowsecurity AS rls_enabled,
    COALESCE(policy_count.count, 0) AS rls_policy_count
FROM
    pg_class t
    JOIN pg_namespace n ON t.relnamespace = n.oid
    LEFT JOIN (
        SELECT
            tablename,
            COUNT(*) as count
        FROM
            pg_policies
        GROUP BY
            tablename
    ) policy_count ON t.relname = policy_count.tablename
WHERE
    n.nspname = 'onbo' 
    AND t.relkind = 'r' 
ORDER BY
    t.relname;
    `;
  }

  async enableRls(tableName: string): Promise<boolean> {
    const { error } = await this.pgManager.query(
      this.generateEnableRlsQuery(tableName),
    );

    if(error){
      throw new Error(error);
    }
    
    return true;
  }

  async getAllTables(): Promise<DatabaseTableInterface[]> {
    const { data, error } = await this.pgManager.query<DatabaseTableResponseInterface>(
      this.generateGetAllTablesQuery(),
    );

    if (!error && data) {
      return data.map((table) => ({
        name: table.table_name,
        rlsEnabled: table.rls_enabled,
        rlsPoliciesCount: parseInt(table.rls_policy_count)
      }));
    }

    throw new Error(error);
  }
}
