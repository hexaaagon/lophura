import { webcrypto } from "node:crypto";
import type { IncomingMessage, ServerResponse } from "node:http";
import { TimeSpan } from "lucia";
import { Lucia } from "lucia/dist/core.js";
import type { Session, User } from "lucia/dist/core.js";
import { DrizzleSQLiteAdapter } from "@lucia-auth/adapter-drizzle";
import { db } from "../db";
import { DatabaseUser, users, userSession } from "../db/schema";

export const adapter = new DrizzleSQLiteAdapter(db, userSession, users);

export const lucia = new Lucia(adapter, {
  sessionCookie: {
    attributes: {
      secure: false,
    },
  },
  sessionExpiresIn: new TimeSpan(1, "d"),
  getUserAttributes: (attributes) => {
    return {
      email: attributes.email,
      rol: attributes.rol,
    };
  },
});

declare module "lucia" {
  interface Register {
    Lucia: typeof lucia;
    DatabaseUserAttributes: Omit<DatabaseUser, "id">;
  }
}

export type ReturnValidateToken = Promise<{
  user: (User & { authId: string }) | null;
  session: Session | null;
}>;

export async function validateRequest(
  req: IncomingMessage,
  res: ServerResponse
): ReturnValidateToken {
  const sessionId = lucia.readSessionCookie(req.headers.cookie ?? "");

  if (!sessionId) {
    return {
      user: null,
      session: null,
    };
  }
  const result = await lucia.validateSession(sessionId);
  if (result?.session?.fresh) {
    res.appendHeader(
      "Set-Cookie",
      lucia.createSessionCookie(result.session.id).serialize()
    );
  }
  if (!result.session) {
    res.appendHeader(
      "Set-Cookie",
      lucia.createBlankSessionCookie().serialize()
    );
  }

  return {
    session: result.session,
    ...((result.user && {
      user: {
        authId: result.user.id,
        email: result.user.email,
        rol: result.user.rol,
        id: result.user.id,
      },
    }) || {
      user: null,
    }),
  };
}

export async function validateWebSocketRequest(
  req: IncomingMessage
): Promise<{ user: User; session: Session } | { user: null; session: null }> {
  const sessionId = lucia.readSessionCookie(req.headers.cookie ?? "");

  if (!sessionId) {
    return {
      user: null,
      session: null,
    };
  }
  const result = await lucia.validateSession(sessionId);
  return result;
}
