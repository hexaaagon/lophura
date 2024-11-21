"use server";
import { db } from "../db";
import * as bcrypt from "bcrypt";
import { apiCreateUser, users, DatabaseUser, zRoles } from "../db/schema";
import { ServiceData } from "../utils/types";
import { eq } from "drizzle-orm";

export async function createUser(
  input: typeof apiCreateUser._type
): Promise<ServiceData<DatabaseUser>> {
  return await db.transaction(async (tx) => {
    const hashedPassword = await bcrypt.hash(input.password, 10);
    const newUser = await tx
      .insert(users)
      .values({
        email: input.email,
        password: hashedPassword,
        rol: input.rol || "user",
        token: input.token,
      })
      .returning()
      .then((res) => res[0]);

    if (!newUser) {
      return {
        success: false,
        error: {
          code: "BAD_REQUEST",
          message: "Error to create the user",
        },
      };
    }

    return {
      success: true,
      data: newUser,
    };
  });
}

export async function findUserByEmail(
  email: string
): Promise<ServiceData<DatabaseUser>> {
  const user = await db.query.users.findFirst({
    where: (user, { eq }) => eq(user.email, email),
  });

  if (!user) {
    return {
      success: false,
      error: {
        code: "NOT_FOUND",
        message: "User not found",
      },
    };
  }

  return {
    success: true,
    data: user,
  };
}

export async function findUserById(
  userId: string
): Promise<ServiceData<DatabaseUser>> {
  const user = await db.query.users.findFirst({
    where: (user, { eq }) => eq(user.id, userId),
  });

  if (!user) {
    return {
      success: false,
      error: {
        code: "NOT_FOUND",
        message: "User not found",
      },
    };
  }

  return {
    success: true,
    data: user,
  };
}

export const findUsers = async (
  rol: typeof zRoles._output
): Promise<ServiceData<DatabaseUser[]>> => {
  const currentUsers = await db.query.users.findMany({
    where: eq(users.rol, rol),
  });

  if (!currentUsers) {
    return {
      success: false,
      error: {
        code: "NOT_FOUND",
        message: "Users not found",
      },
    };
  }

  return {
    success: true,
    data: currentUsers,
  };
};
