import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { nanoid } from "nanoid";
import { users } from "./user";

export const workspaces = sqliteTable("workspace", {
  id: text("id").notNull().primaryKey(),
  path: text("path").notNull(),
  name: text("name").notNull(),
  createdBy: text("created_by")
    .notNull()
    .references(() => users.id),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
});

export const workspaceItems = sqliteTable("workspace_item", {
  name: text("name").notNull().primaryKey(),
  workspaceId: text("workspace_id")
    .notNull()
    .references(() => workspaces.id),
  path: text("path").notNull(),
  createdBy: text("created_by")
    .notNull()
    .references(() => users.id),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
  modifiedAt: integer("modified_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
  state: text("state").notNull().default("open").$type<"open" | "trash">(),
  starred: text("starred", { mode: "json" })
    .notNull()
    .default([])
    .$type<string[]>(),

  info: text("info", { mode: "json" }).notNull().$type<
    | {
        type: "file";
        size: number;
      }
    | {
        type: "folder";
      }
  >(),
});
