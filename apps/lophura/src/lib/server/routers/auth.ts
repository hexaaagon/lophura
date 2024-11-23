import { publicProcedure, router } from "@/lib/server/trpc";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";

export const authRouter = router({
  getUserAuth: publicProcedure.query(async ({ ctx }) => {
    return ctx.session;
  }),
  getUserCount: publicProcedure.query(async ({ ctx }) => {
    return (await db.select().from(users)).length;
  }),
});
