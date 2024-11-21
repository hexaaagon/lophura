import { nanoid } from "nanoid";
import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export type DatabaseUser = typeof users.$inferSelect;
export const zRoles = z.enum(["admin", "read-write", "read-only"]);

export const users = sqliteTable("users", {
  id: text("id")
    .notNull()
    .primaryKey()
    .$defaultFn(() => nanoid()),
  email: text("email").notNull(),
  password: text("password").notNull(),
  rol: text("rol").notNull(),
  token: text("token").notNull(),
  createdAt: integer("createdAt", {
    mode: "timestamp",
  })
    .notNull()
    .$defaultFn(() => new Date()),
  updatedAt: integer("updatedAt", {
    mode: "timestamp",
  })
    .notNull()
    .$defaultFn(() => new Date()),
});

const createSchema = createInsertSchema(users, {
  email: z.string().email(),
  password: z.string(),
  rol: zRoles,
});

export const apiCreateUser = createSchema.pick({
  email: true,
  password: true,
  rol: true,
  token: true,
});

export const apiLogin = createSchema.pick({
  email: true,
  password: true,
});
