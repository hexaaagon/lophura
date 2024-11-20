import { LibSQLDatabase, drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
import * as schema from "./schema";

declare global {
  // eslint-disable-next-line no-var
  var db: LibSQLDatabase<typeof schema> | undefined;
}

export let db: LibSQLDatabase<typeof schema>;
if (process.env.NODE_ENV === "production") {
  db = drizzle(createClient({ url: "file:lophura.db" }), {
    schema,
  });
} else {
  if (!global.db)
    global.db = drizzle(createClient({ url: "file:lophura.db" }), {
      schema,
    });

  db = global.db;
}
