"use server";

import { api } from "../trpc/api";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { Argon2id } from "oslo/password";
import { lucia, validateRequest } from "../auth/lucia";
import { nanoid } from "@/lib/utils";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db/index";

import {
  genericError,
  setAuthCookie,
  validateAuthLoginFormData,
  getUserAuth,
  validateAuthRegisterFormData,
} from "../auth/utils";
import { users, updateUserSchema } from "../db/schema";

type ActionResult =
  | {
      success: true;
      data: {
        type: "redirect";
        path: string;
      };
    }
  | { success: false; error: string };

export async function signInAction(
  _: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  const { data, error } = validateAuthLoginFormData(formData);
  if (error !== null) return { success: false, error };

  try {
    const [existingUser] = await db
      .select()
      .from(users)
      .where(eq(users.email, data.email.toLowerCase()));
    if (!existingUser) {
      return {
        success: false,
        error: "Incorrect username or password",
      };
    }

    const validPassword = await new Argon2id().verify(
      existingUser.hashedPassword,
      data.password,
    );
    if (!validPassword) {
      return {
        success: false,
        error: "Incorrect username or password",
      };
    }

    const session = await lucia.createSession(existingUser.id, {});
    const sessionCookie = lucia.createSessionCookie(session.id);
    await setAuthCookie(sessionCookie);

    return { success: true, data: { type: "redirect", path: "/dashboard" } };
  } catch (e) {
    console.error(1, e);

    return genericError(e);
  }
}

export async function signUpAction(
  _: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  const { data, error } = validateAuthRegisterFormData(formData);
  if (error !== null) return { success: false, error };

  const isFirstInstall = (await api.auth.getUserCount.query()) === 0;
  if (!isFirstInstall) {
    return {
      success: false,
      error:
        "You have already signed up, please contact admin to create a new account.",
    };
  }

  const hashedPassword = await new Argon2id().hash(data.password);
  const userId = nanoid(15);

  try {
    await db.insert(users).values({
      id: userId,
      email: data.email,
      hashedPassword,
    });
  } catch (e) {
    console.error(2, e);

    return genericError(e);
  }

  const session = await lucia.createSession(userId, {});
  const sessionCookie = lucia.createSessionCookie(session.id);
  await setAuthCookie(sessionCookie);
  return { success: true, data: { type: "redirect", path: "/dashboard" } };
}

export async function signOutAction(): Promise<ActionResult> {
  const { session } = await validateRequest();
  if (!session) {
    return { success: false, error: "Unauthorized" };
  }

  await lucia.invalidateSession(session.id);

  const sessionCookie = lucia.createBlankSessionCookie();
  await setAuthCookie(sessionCookie);
  redirect("/");
}

export async function updateUser(
  _: any,
  formData: FormData,
): Promise<ActionResult & { success?: boolean }> {
  const { session } = await getUserAuth();
  if (!session) return { success: false, error: "Unauthorised" };

  const name = formData.get("name") ?? undefined;
  const email = formData.get("email") ?? undefined;

  const result = updateUserSchema.safeParse({ name, email });

  if (!result.success) {
    const error = result.error.flatten().fieldErrors;
    if (error.name)
      return { success: false, error: "Invalid name - " + error.name[0] };
    if (error.email)
      return { success: false, error: "Invalid email - " + error.email[0] };
    console.error(3);
    return genericError();
  }

  try {
    await db
      .update(users)
      .set({ ...result.data })
      .where(eq(users.id, session.user.id));
    revalidatePath("/account");
    return { success: false, error: "" };
  } catch (e) {
    console.error(4, e);
    return genericError(e);
  }
}
