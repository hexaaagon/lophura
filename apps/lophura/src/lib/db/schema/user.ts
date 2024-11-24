import { z } from "zod";
import { createInsertSchema } from "drizzle-zod";
import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { nanoid } from "@/lib/utils";

export const users = sqliteTable("user", {
  id: text("id")
    .notNull()
    .primaryKey()
    .$defaultFn(() => nanoid(15)),
  email: text("email").notNull().unique(),
  hashedPassword: text("hashed_password").notNull(),
  name: text("name"),
});

const createSchema = createInsertSchema(users, {
  id: z.string(),
  email: z.string().email(),
  hashedPassword: z.string(),
  name: z.string().optional(),
});

export const authenticationSchema = z.object({
  email: z.string().email().min(5).max(64),
  password: z
    .string()
    .min(4, { message: "must be at least 4 characters long" })
    .max(15, { message: "cannot be more than 15 characters long" }),
});

export const authenticationRegisterSchema = z
  .object({
    email: z.string().email().min(5).max(64),
    password: z
      .string()
      .min(4, { message: "must be at least 4 characters long" })
      .max(15, { message: "cannot be more than 15 characters long" }),
    passwordConfirm: z
      .string()
      .min(4, { message: "must be at least 4 characters long" })
      .max(15, { message: "cannot be more than 15 characters long" }),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: "Passwords do not match",
    path: ["passwordConfirm"],
  });

export const updateUserSchema = z.object({
  name: z.string().min(3).optional(),
  email: z.string().min(4).optional(),
});
