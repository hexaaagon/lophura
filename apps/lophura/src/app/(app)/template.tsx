"use client";
import { ComponentProps, useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";
import { AppSidebar } from "@/components/sidebar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useIsMobile } from "@/lib/hooks/use-mobile";

export const staticRouteInfo: [
  /** @name Name */ string,
  /** @name href */ string,
][] = [
  ["Home", "/home"],

  ["Settings", "/settings"],
  ["Theme", "/settings/theme"],
  ["Account", "/settings/account"],

  // Parents of Dynamic Routes
  ["Workspace", "/workspace"],
  ["Starred", "/starred"],
];

export default function AppTemplate({ children }: ComponentProps<"div">) {
  const [commandOpen, setCommandOpen] = useState(false);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setCommandOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const pathname = usePathname();
  const isMobile = useIsMobile();

  return (
    <>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset className="px-4">
          <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear">
            <div className="flex w-full items-center gap-2 px-4">
              {isMobile && (
                <>
                  <SidebarTrigger className="-ml-1" />
                  <Separator orientation="vertical" className="mr-2 h-4" />
                </>
              )}

              <Button
                variant="outline"
                className="flex w-full justify-between gap-2 text-sm lg:w-3/4 2xl:w-1/2"
                onClick={() => setCommandOpen(true)}
              >
                <span>Search</span>
                {!isMobile && (
                  <kbd className="pointer-events-none flex h-5 items-center gap-1 rounded border bg-muted px-1.5 font-grotesque text-[12px] font-medium">
                    <span>⌘</span>K
                  </kbd>
                )}
              </Button>
            </div>
          </header>
          <main className="flex flex-1 flex-col gap-4 p-4 pt-1">
            {children}
          </main>
        </SidebarInset>
      </SidebarProvider>
      <CommandDialog open={commandOpen} onOpenChange={setCommandOpen}>
        <CommandInput placeholder="Type a command or search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Suggestions">
            <CommandItem>Calendar</CommandItem>
            <CommandItem>Search Emoji</CommandItem>
            <CommandItem>Calculator</CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}
