import { redirect } from "next/navigation";
import { cookies } from "next/headers";

import { type Cookie } from "lucia";

import { validateRequest } from "./lucia";
import {
  authenticationRegisterSchema,
  authenticationSchema,
} from "../db/schema";
import { z } from "zod";

export type AuthSession = {
  session: {
    user: {
      id: string;
      name?: string;
      email?: string;
      username?: string;
    };
  } | null;
};
export const getUser = async (): Promise<AuthSession> => {
  const { session, user } = await validateRequest();
  if (!session) return { session: null };
  return {
    session: {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    },
  };
};

export const checkAuth = async () => {
  const { session } = await validateRequest();
  if (!session) redirect("/");
};

export const genericError = (e?: any) => {
  return {
    success: false,
    error: `Error, ${e instanceof Error ? e.message : "please try again later."}`,
  } as { success: false; error: string };
};

export const setAuthCookie = async (cookie: Cookie) => {
  const cookieStore = await cookies();
  // cookieStore.set(cookie.name, cookie.value, cookie.attributes); // <- suggested approach from the docs, but does not work with `next build` locally
  cookieStore.set(cookie);
};

const getErrorMessage = (errors: any): string => {
  if (errors.email) return "Invalid Email";
  if (errors.password) return "Invalid Password - " + errors.password[0];
  if (errors.passwordConfirm) return errors.passwordConfirm[0];
  return ""; // return a default error message or an empty string
};

export const validateAuthLoginFormData = (
  formData: FormData,
):
  | { data: z.infer<typeof authenticationSchema>; error: null }
  | { data: null; error: string } => {
  const email = formData.get("email");
  const password = formData.get("password");
  const result = authenticationSchema.safeParse({ email, password });

  if (!result.success) {
    return {
      data: null,
      error: getErrorMessage(result.error.flatten().fieldErrors),
    };
  }

  return { data: result.data, error: null };
};

export const validateAuthRegisterFormData = (
  formData: FormData,
):
  | { data: z.infer<typeof authenticationRegisterSchema>; error: null }
  | { data: null; error: string } => {
  const email = formData.get("email");
  const password = formData.get("password");
  const passwordConfirm = formData.get("passwordConfirm");
  const result = authenticationRegisterSchema.safeParse({
    email,
    password,
    passwordConfirm,
  });

  if (!result.success) {
    return {
      data: null,
      error: getErrorMessage(result.error.flatten().fieldErrors),
    };
  }

  return { data: result.data, error: null };
};

export const getUserAvatar = async (userEmail: string) => {
  const hash = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(userEmail),
  );

  return `https://www.gravatar.com/avatar/${Buffer.from(hash).toString("hex")}?d=404`;
};
