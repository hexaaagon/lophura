import type { Config } from "drizzle-kit";
import { env } from "@/lib/env.mjs";

export default {
  schema: "./src/lib/db/schema",
  dialect: "sqlite",
  out: "./src/lib/db/migrations",
  dbCredentials: {
    url: "lophura.db",
  },
} satisfies Config;
