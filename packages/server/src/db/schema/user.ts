import { z } from "zod";
import { createInsertSchema } from "drizzle-zod";
import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { nanoid } from "../../utils";

export const users = sqliteTable("user", {
  id: text("id")
    .notNull()
    .primaryKey()
    .$defaultFn(() => nanoid(15)),
  email: text("email").notNull().unique(),
  hashedPassword: text("hashed_password").notNull(),
  name: text("name").default("User"),
  permission: text("permission")
    .notNull()
    .$type<"admin" | "write-read" | "read-only">(),
});

export type PublicUser = Omit<typeof users.$inferSelect, "hashedPassword"> & {
  hashedPassword?: string;
};

export const authenticationSchema = z.object({
  email: z.string().email().min(5).max(64),
  password: z
    .string()
    .min(4, { message: "must be at least 4 characters long" }),
});

export const authenticationRegisterSchema = z
  .object({
    email: z.string().email().min(5).max(64),
    password: z
      .string()
      .min(4, { message: "must be at least 4 characters long" }),
    passwordConfirm: z
      .string()
      .min(4, { message: "must be at least 4 characters long" }),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: "Passwords do not match",
    path: ["passwordConfirm"],
  });

export const updateUserSchema = z.object({
  name: z.string().min(3).optional(),
  email: z.string().min(4).optional(),
});
