"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { Toaster } from "./ui/sonner";

export function ThemeProvider({ children }: React.ComponentProps<"div">) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      {children}
      <Toaster richColors expand />
    </NextThemesProvider>
  );
}
