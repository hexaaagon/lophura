import { drizzle, BetterSQLite3Database } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import { config } from "dotenv";

config({ path: "../../.env" });

export const sqlite = new Database(process.env.DATABASE_URL);
export const db: BetterSQLite3Database = drizzle(sqlite);
