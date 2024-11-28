"use client";
import { ComponentProps } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
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
  const pathname = usePathname();
  const isMobile = useIsMobile();

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="px-4">
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear">
          <div className="flex items-center gap-2 px-4">
            {isMobile && (
              <>
                <SidebarTrigger className="-ml-1" />
                <Separator orientation="vertical" className="mr-2 h-4" />
              </>
            )}
            <Breadcrumb>
              <BreadcrumbList>
                {staticRouteInfo.reduce((acc, [name, href]) => {
                  if (pathname === href) {
                    acc.push(
                      <BreadcrumbItem key={href}>
                        <BreadcrumbPage>{name}</BreadcrumbPage>
                      </BreadcrumbItem>,
                    );
                  } else if (pathname.startsWith(href)) {
                    acc.push(
                      <BreadcrumbItem key={href}>
                        <BreadcrumbLink asChild>
                          <Link href={href}>{name}</Link>
                        </BreadcrumbLink>
                      </BreadcrumbItem>,
                    );
                    if (pathname !== href) {
                      acc.push(
                        <BreadcrumbSeparator key={`${href}-separator`} />,
                      );
                    }
                  }
                  return acc;
                }, [] as React.ReactNode[])}
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 pt-0">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
