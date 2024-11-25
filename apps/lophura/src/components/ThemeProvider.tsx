"use client";

import { type ComponentProps, useEffect } from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { Toaster } from "./ui/sonner";

import { StoreProvider } from "easy-peasy";
import { store, StoreActions } from "@/lib/store";
import { getUserData } from "@/lib/actions/users";

export function ThemeProvider({ children }: ComponentProps<"div">) {
  useEffect(() => {
    if (!store.getState().user) {
      getUserData().then((res): void => {
        const storeActions = store.getActions() as StoreActions;

        res?.user && storeActions.setUser(res.user);
        res?.auth && storeActions.setAuth(res.auth);
        res?.session && storeActions.setSession(res.session);
      });
    }
  }, []);

  return (
    <StoreProvider store={store}>
      <NextThemesProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        {children}
        <Toaster richColors expand />
      </NextThemesProvider>
    </StoreProvider>
  );
}
