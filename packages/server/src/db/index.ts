import { drizzle, BetterSQLite3Database } from "drizzle-orm/better-sqlite3";
import Database, { Database as BetterDatabase } from "better-sqlite3";
import { config } from "dotenv";

config({ path: "../../.env" });

export const sqlite: BetterDatabase = new Database("lophura.db");
export const db: BetterSQLite3Database = drizzle(sqlite);
