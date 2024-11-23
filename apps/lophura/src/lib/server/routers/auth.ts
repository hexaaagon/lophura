import { publicProcedure, router } from "@/lib/server/trpc";

export const authRouter = router({
  getUserAuth: publicProcedure.query(async ({ ctx }) => {
    return ctx.session;
  }),
});
