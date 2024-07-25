import type { PostgresManagerInterface } from "./postgres.manager";

export interface DatabaseRoleInterface {
  name: string;
}

interface DatabaseRoleResponseInterface {
  rolname: string;
}

interface DatabaseManagerInterface {
  getAllUserCreatedRoles(): Promise<DatabaseRoleInterface[]>;
}

export default class DatabaseManager implements DatabaseManagerInterface {
  private pgManager: PostgresManagerInterface;

  constructor(
    pgManager: PostgresManagerInterface,
  ) {
    this.pgManager = pgManager;
  }

  private generateGetAllRolesQuery() {
    // below 16384 is all system roles generally
    return `
      SELECT rolname
      FROM pg_roles
      WHERE oid >= 16384;
    `;
  }

  async getAllUserCreatedRoles(): Promise<DatabaseRoleInterface[]> {
    const { data, error } = await this.pgManager.query<
      DatabaseRoleResponseInterface
    >(
      this.generateGetAllRolesQuery(),
    );
    if (!error && data) {
      return data?.map((role) => ({
        name: role.rolname,
      }));
    }

    throw new Error(error);
  }
}
