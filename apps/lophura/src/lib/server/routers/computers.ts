import { publicProcedure, router } from "@/lib/server/trpc";

export const computersRouter = router({
  getComputers: publicProcedure.query(async () => {
    return [
      { id: 1, name: "Apple I" },
      { id: 2, name: "Apple II" },
      { id: 3, name: "Macintosh" },
    ];
  }),
});
