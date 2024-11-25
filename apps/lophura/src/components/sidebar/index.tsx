"use client";
import Image from "next/image";
import Link from "next/link";

import * as React from "react";
import * as Lucide from "lucide-react";

import { NavMain } from "./nav/main";
import { NavSecondary } from "./nav/secondary";
import { NavUser } from "./nav/user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

import { version } from "#/package.json";
import { useStoreState } from "easy-peasy";
import { StoreType } from "@/lib/store";

const data = {
  navMain: [
    {
      title: "Home",
      url: "/home",
      icon: Lucide.Home,
    },
    {
      title: "Workspaces",
      url: "/workspace",
      icon: Lucide.HardDrive,
      items: [
        {
          title: "Example Workspace 1",
          url: "/workspace/example-workspace-1",
        },
        {
          title: "Example Workspace 2",
          url: "/workspace/example-workspace-2",
        },
        {
          title: "Example Workspace 3",
          url: "/workspace/example-workspace-3",
        },
      ],
    },
    {
      title: "Starred",
      url: "/starred",
      icon: Lucide.Star,
      items: [
        {
          title: "Example File 1",
          url: "/workspace/example-workspace-1/folders/example/example-file-1.docx",
        },
      ],
    },
    {
      title: "Settings",
      url: "/settings",
      icon: Lucide.Settings2,
      items: [
        {
          title: "Theme",
          url: "/settings/theme",
        },
        {
          title: "Account",
          url: "/settings/account",
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: `Lophura v${version}`,
      url: "https://github.com/hexaaagon/lophura",
      icon: Lucide.GitBranch,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const user = useStoreState((state: StoreType) => state.user!);

  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/home" className="flex items-center gap-1">
                <div className="size-8">
                  <Image
                    src="/static/images/icons/lophura-dark.svg"
                    alt="Lophura"
                    width={64}
                    height={64}
                    className="mb-2 block dark:hidden"
                  />
                  <Image
                    src="/static/images/icons/lophura-light.svg"
                    alt="Lophura"
                    width={64}
                    height={64}
                    className="mb-2 hidden dark:block"
                  />
                </div>
                <div>
                  <p className="truncate font-grotesque text-lg">Lophura</p>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
