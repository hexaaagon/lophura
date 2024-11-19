import {
  integer,
  sqliteTable,
  text,
  SQLiteTextJsonBuilder,
} from "drizzle-orm/sqlite-core";
import { createInsertSchema } from "drizzle-zod";
import { nanoid } from "nanoid";
import { z } from "zod";

export const monitoring = sqliteTable("monitoring", {
  createdAt: text("createdAt")
    .notNull()
    .$defaultFn(() => new Date().toISOString()),
  id: text("id")
    .notNull()
    .primaryKey()
    .$defaultFn(() => nanoid()),
  diskUsage: integer("diskUsage").notNull(),
  memoryUsage: integer("memoryUsage").notNull(),
  cpuUsage: integer("cpuUsage").notNull(),
  // networkIn: integer("networkIn").notNull(),
  // networkOut: integer("networkOut").notNull(),
});

const createSchema = createInsertSchema(monitoring, {
  createdAt: z.date(),
  id: z.string(),
  diskUsage: z.number(),
  memoryUsage: z.number(),
  cpuUsage: z.number(),
  // networkIn: z.number(),
  // networkOut: z.number(),
});

export const apiCreateMonitoring = createSchema
  .pick({
    diskUsage: true,
    memoryUsage: true,
    cpuUsage: true,
    // networkIn: true,
    // networkOut: true,
  })
  .required();

export const apiFindIDMonitoring = createSchema
  .pick({
    id: true,
  })
  .required();

export const apiFindDateMonitoring = createSchema
  .pick({
    createdAt: true,
  })
  .required();
