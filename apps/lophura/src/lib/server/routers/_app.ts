import { authRouter } from "./auth";
import { computersRouter } from "./computers";
import { router } from "@/lib/server/trpc";

export const appRouter = router({
  auth: authRouter,
  computers: computersRouter,
});

export type AppRouter = typeof appRouter;
