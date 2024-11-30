import { authRouter } from "./auth";
import { router } from "@/lib/server/trpc";

export const appRouter = router({
  auth: authRouter,
});

export type AppRouter = typeof appRouter;
