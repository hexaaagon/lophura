import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/server/db/schema/index.ts",
  dialect: "sqlite",
  dbCredentials: {
    url: "file:lophura.db",
  },
  out: "drizzle",
  // migrations: {
  //   table: "migrations",
  //   schema: "public",
  // },
});
