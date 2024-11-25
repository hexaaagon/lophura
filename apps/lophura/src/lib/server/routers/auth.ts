import { protectedProcedure, publicProcedure, router } from "@/lib/server/trpc";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { lucia } from "@/lib/auth/lucia";
import { getUserAvatar } from "@/lib/auth/utils";

export const authRouter = router({
  getUser: publicProcedure.query(async ({ ctx }) => {
    return ctx.session;
  }),
  getUserCount: publicProcedure.mutation(async ({ ctx }) => {
    return (await db.select().from(users)).length;
  }),
  getAvatar: protectedProcedure.query(async ({ ctx }) => {
    return await getUserAvatar(ctx.session.user.email!);
  }),
  edge: router({
    getSessionCookieName: publicProcedure.query(async ({ ctx }) => {
      return lucia.sessionCookieName;
    }),
  }),
});
