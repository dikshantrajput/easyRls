import type { PostgresManagerInterface } from "./postgres.manager";

export interface RlsPolicyInterface {
  name: string;
  type: "PERMISSIVE" | "RESTRICTIVE";
  roles: string[];
  crud: "SELECT" | "INSERT" | "UPDATE" | "DELETE";
  using: string;
  withCheck?: string;
}

interface RlsPolicyResponseInterface {
  policyname: string;
  cmd: "SELECT" | "INSERT" | "UPDATE" | "DELETE";
  roles: string;
  permissive: "PERMISSIVE" | "RESTRICTIVE";
  qual: string;
}

interface RlsManagerInterface {
  enable(): Promise<boolean>;
  disable(): Promise<boolean>;
  getAllPolicies(): Promise<RlsPolicyInterface[]>;
  getSinglePolicy(name: string): Promise<RlsPolicyInterface | null>;
  updatePolicy(payload: UpdatePolicyPayload): Promise<boolean>;
  deletePolicy(name: string): Promise<boolean>;
}

interface RlsManagerOptionsInterface {
  tableName: string;
  schemaName: string;
}

interface UpdatePolicyPayload {
  name: string;
  roles?: string[];
  using?: string;
  withCheck?: string;
}

export default class RlsManager implements RlsManagerInterface {
  private pgManager: PostgresManagerInterface;
  private options: RlsManagerOptionsInterface;

  constructor(
    pgManager: PostgresManagerInterface,
    options: RlsManagerOptionsInterface,
  ) {
    this.pgManager = pgManager;
    this.options = options;
  }

  private generateEnableRlsQuery() {
    return `ALTER TABLE ${this.options.schemaName}.${this.options.tableName} ENABLE ROW LEVEL SECURITY;`;
  }

  private generateDisableRlsQuery() {
    return `ALTER TABLE ${this.options.schemaName}.${this.options.tableName} DISABLE ROW LEVEL SECURITY;`;
  }

  private generateGetAllPoliciesQuery() {
    return `SELECT policyname, cmd, roles, permissive, qual FROM pg_policies
      WHERE schemaname = '${this.options.schemaName}'
      AND tablename = '${this.options.tableName}';
    `;
  }

  private generateGetSinglePolicyQuery(name: string) {
    return `SELECT cmd, roles, permissive, qual FROM pg_policies
      WHERE schemaname = '${this.options.schemaName}'
      AND tablename = '${this.options.tableName} where name = ${name}';
    `;
  }

  private generateUpdatePolicyQuery(payload: UpdatePolicyPayload): string {
    let query =
      `ALTER POLICY ${payload.name} ON '${this.options.schemaName}'.'${this.options.tableName}';`;

    if (payload.roles && payload.roles.length > 0) {
      query += ` TO ${payload.roles.join(", ")}`;
    }

    if (payload.using) {
      query += ` USING (${payload.using})`;
    }

    if (payload.withCheck) {
      query += ` WITH CHECK (${payload.withCheck})`;
    }

    query += ";";

    return query;
  }

  private generateDeleteRlsPolicyQuery(name: string) {
    return `DROP POLICY IF EXISTS ${name} ON ${this.options.schemaName}.${this.options.tableName};`;
  }

  async enable(): Promise<boolean> {
    const { error } = await this.pgManager.query(this.generateEnableRlsQuery());

    if (error) {
      throw new Error(error);
    }

    return true;
  }

  async disable(): Promise<boolean> {
    const { error } = await this.pgManager.query(
      this.generateDisableRlsQuery(),
    );

    if (error) {
      throw new Error(error);
    }

    return true;
  }

  async getAllPolicies(): Promise<RlsPolicyInterface[]> {
    const { data, error } = await this.pgManager.query<
      RlsPolicyResponseInterface
    >(
      this.generateGetAllPoliciesQuery(),
    );

    if (!error && data) {
      return data.map((policy) => ({
        crud: policy.cmd,
        name: policy.policyname,
        roles: policy.roles.length > 2
          ? policy.roles.slice(1, -1)?.split(",").map((item) => item.trim())
          : [],
        type: policy.permissive,
        using: policy.qual,
        withCheck: policy.qual,
      }));
    }

    throw new Error(error);
  }

  async getSinglePolicy(name: string): Promise<RlsPolicyInterface | null> {
    const { data, error } = await this.pgManager.query<
      RlsPolicyResponseInterface
    >(
      this.generateGetSinglePolicyQuery(name),
    );

    if (!error && data) {
      return data?.[0]
        ? {
          crud: data[0].cmd,
          name: data[0].policyname,
          roles: data[0].roles.length > 2
            ? data[0].roles.slice(1, -1)?.split(",").map((item) => item.trim())
            : [],
          type: data[0].permissive,
          using: data[0].qual,
          withCheck: data[0].qual,
        }
        : null;
    }

    throw new Error(error);
  }

  async updatePolicy(payload: UpdatePolicyPayload): Promise<boolean> {
    const { error } = await this.pgManager.query<RlsPolicyResponseInterface>(
      this.generateUpdatePolicyQuery(payload),
    );

    if (error) {
      throw new Error(error);
    }

    return true;
  }

  async deletePolicy(name: string): Promise<boolean> {
    const { error } = await this.pgManager.query(
      this.generateDeleteRlsPolicyQuery(name),
    );

    if (error) {
      throw new Error(error);
    }

    return true;
  }
}
