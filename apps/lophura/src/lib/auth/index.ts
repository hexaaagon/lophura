"use server";
import * as bcrypt from "bcrypt";
import { apiCreateUser, apiLogin, DatabaseUser } from "@/server/db/schema";
import {
  lucia,
  findUserByEmail,
  createUser as dbCreateUser,
  findUserById,
} from "@lophura/server";

import { cookies } from "next/headers";

export * from "./schema";

export async function createUser(input: typeof apiCreateUser._type) {
  try {
    const newUser = await dbCreateUser(input);
    if (!newUser.success)
      return {
        success: false,
        error: {
          code: "BAD_REQUEST",
          message: "Error to create the user",
        },
      };

    const cookieStore = await cookies();

    const session = await lucia.createSession(newUser.data.id || "", {});
    const cookie = lucia.createSessionCookie(session.id);

    cookieStore.set(cookie.name, cookie.value, cookie.attributes);

    return {
      success: true,
    };
  } catch (e) {
    return {
      success: false,
      error: {
        code: "BAD_REQUEST",
        message: "Error to create the user",
        cause: e,
      },
    };
  }
}

export async function login(input: typeof apiLogin._input) {
  try {
    const user = await findUserByEmail(input.email);

    if (!user.success)
      return {
        success: false,
        error: {
          code: "NOT_FOUND",
          message: "User not found",
        },
      };

    const correctPassword = bcrypt.compareSync(
      input.password,
      user.data.password || ""
    );

    if (!correctPassword)
      return {
        success: false,
        error: {
          code: "BAD_REQUEST",
          message: "Credentials do not match",
        },
      };

    const cookieStore = await cookies();
    const session = await lucia.createSession(user.data.id || "", {});
    const cookie = lucia.createSessionCookie(session.id);

    cookieStore.set(cookie.name, cookie.value, cookie.attributes);

    return {
      userId: user.data.id,
    };
  } catch (e) {
    return {
      success: false,
      error: {
        code: "BAD_REQUEST",
        message: `Error: ${e instanceof Error ? e.message : "Error to login"}`,
        cause: e,
      },
    };
  }
}

export async function get(input: DatabaseUser) {
  const user = await findUserById(input.id);

  if (!user.success)
    return {
      success: false,
      error: {
        code: "NOT_FOUND",
        message: "User not found",
      },
    };

  return {
    success: true,
    data: user.data,
  };
}
