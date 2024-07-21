import type { Client, QueryResult, QueryResultRow } from "pg";
import pg from "pg";

interface PostgresManagerSuccessResult<T> {
  data: T[];
  error: null;
}

interface PostgresManagerErrorResult {
  data: null;
  error: string;
}

type PostgresManagerMethodReturnType<T> =
  | PostgresManagerSuccessResult<T>
  | PostgresManagerErrorResult;

export interface PostgresManagerInterface {
  query<T extends QueryResultRow>(
    query: string,
  ): Promise<PostgresManagerMethodReturnType<T>>;
}

// TODO: disconnection of instances connected

const postgresManagerCreator = () => {
  const managerInstances: Map<string, PostgresManager> = new Map();

  const initializePostgresManager = async (
    connectionUrl: string,
  ): Promise<PostgresManager> => {
    if (!managerInstances.has(connectionUrl)) {
      const constructInstance = await PostgresManager.initialize(connectionUrl);
      if (!constructInstance.error && constructInstance.data?.length) {
        managerInstances.set(connectionUrl, constructInstance.data[0]);
      } else {
        throw Error(constructInstance.error ?? "Error connecting to database");
      }
    }
    return managerInstances?.get(connectionUrl) as PostgresManager;
  };

  class PostgresManager implements PostgresManagerInterface {
    private pgClient: Client;
    private isConnected = false;

    private constructor(connectionUrl: string) {
      this.pgClient = new pg.Client(connectionUrl);
    }

    public static async initialize(
      connectionUrl: string,
    ): Promise<PostgresManagerMethodReturnType<PostgresManager>> {
      const manager = new PostgresManager(connectionUrl);
      try {
        await manager.pgClient.connect();
        manager.isConnected = true;
        return { data: [manager], error: null };
      } catch (err) {
        return {
          data: null,
          error: err instanceof Error ? err.message : String(err),
        };
      }
    }

    async disconnect(): Promise<PostgresManagerMethodReturnType<null>> {
      if (!this.isConnected) {
        return { data: [], error: null };
      }

      try {
        await this.pgClient.end();
        this.isConnected = false;
        return { data: [], error: null };
      } catch (err) {
        return {
          data: null,
          error: err instanceof Error ? err.message : String(err),
        };
      }
    }

    async query<T extends QueryResultRow>(
      query: string,
    ): Promise<PostgresManagerMethodReturnType<T>> {
      if (!this.isConnected) {
        return { data: null, error: "Database is not connected." };
      }

      try {
        const queryResult: QueryResult<T> = await this.pgClient.query<T>(query);
        return { data: queryResult.rows, error: null };
      } catch (err) {
        return {
          data: null,
          error: err instanceof Error ? err.message : String(err),
        };
      }
    }
  }

  return initializePostgresManager;
};

// for keeping singleton instance
export default postgresManagerCreator();
