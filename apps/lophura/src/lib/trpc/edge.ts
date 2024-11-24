import { createTRPCProxyClient, httpBatchLink } from "@trpc/client";
import type { AppRouter } from "@/lib/server/routers/_app";
import SuperJSON from "superjson";
import { getUrl } from "./utils";

export const edgeApi = createTRPCProxyClient<AppRouter>({
  transformer: SuperJSON,
  links: [
    httpBatchLink({
      url: getUrl(),
      fetch(url, options) {
        return fetch(url, {
          ...options,
        });
      },
    }),
  ],
});
