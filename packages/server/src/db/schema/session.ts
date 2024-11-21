import { nanoid } from "nanoid";
import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { users } from "./user";

export const userSession = sqliteTable("user_session", {
  id: text("id").primaryKey(),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expiresAt: integer("expiresAt").notNull(),
});
