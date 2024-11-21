import { z } from "zod";

export const registerSchema = z
  .object({
    email: z
      .string()
      .min(1, {
        message: "Email is required",
      })
      .email({
        message: "Email must be a valid email address",
      }),
    password: z
      .string()
      .min(1, {
        message: "Password is required",
      })
      .refine((password) => password === "" || password.length >= 8, {
        message: "Password must be at least 8 characters",
      }),
    confirmPassword: z
      .string()
      .min(1, {
        message: "Password is required",
      })
      .refine((password) => password === "" || password.length >= 8, {
        message: "Password must be at least 8 characters",
      }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });
