import { publicProcedure, router } from "@/lib/server/trpc";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { lucia } from "@/lib/auth/lucia";

export const authRouter = router({
  getUserAuth: publicProcedure.query(async ({ ctx }) => {
    return ctx.session;
  }),
  getUserCount: publicProcedure.query(async ({ ctx }) => {
    return (await db.select().from(users)).length;
  }),
  edge: router({
    getSessionCookieName: publicProcedure.query(async ({ ctx }) => {
      return lucia.sessionCookieName;
    }),
    getUserAuth: publicProcedure.mutation(async ({ ctx, input }) => {}),
  }),
});
