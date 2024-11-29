"use client";

import * as React from "react";
import {
  ArchiveX,
  Construction,
  Files,
  FileText,
  FileVideo,
  House,
  Server,
  Trash,
} from "lucide-react";

import { NavUser } from "@/components/sidebar/nav-user";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarInput,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { Switch } from "@/components/ui/switch";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import { store, StoreActions, StoreType } from "@/lib/store";
import { useStoreState } from "easy-peasy";

// This is sample data
const data: {
  navMain: {
    title: string;
    url: string;
    icon: any;
  }[];
  navSecondary: {
    [key: string]: {
      name: string;
      url: string;
      icon: any;
    }[];
  };
} = {
  navMain: [
    {
      title: "Home",
      url: "/home",
      icon: House,
    },
    {
      title: "Workspace",
      url: "/workspace",
      icon: Server,
    },
  ],
  navSecondary: {
    Home: [
      {
        name: "All Files",
        url: "/home",
        icon: Files,
      },
      {
        name: "Photos & Media",
        url: "/media",
        icon: FileVideo,
      },
      {
        name: "Documents",
        url: "/documents",
        icon: FileText,
      },
      {
        name: "Archived",
        url: "/archive",
        icon: ArchiveX,
      },
      {
        name: "Deleted Files",
        url: "/trash",
        icon: Trash,
      },
    ],
  },
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  // Note: I'm using state to show active item.
  // IRL you should use the url/router.
  const [activeItem, setActiveItem] = React.useState(data.navMain[0]);
  const { setOpen, isMobile } = useSidebar();

  const router = useRouter();
  const pathname = usePathname();

  const currentRoute = useStoreState((state: StoreType) => state.currentRoute);

  // Adds dynamic navigation
  const secondaryNav: {
    [key: string]: { name: string; url: string; icon: any }[];
  } = {
    Workspace: [
      {
        name: "Coming Soon!",
        url: "/workspace",
        icon: Construction,
      },
    ],
    ...data.navSecondary,
  };

  return (
    <Sidebar
      collapsible="icon"
      className="overflow-hidden [&>[data-sidebar=sidebar]]:flex-row"
      {...props}
    >
      {/* This is the first sidebar */}
      {/* We disable collapsible and adjust width to icon. */}
      {/* This will make the sidebar appear as icons. */}
      <Sidebar
        collapsible="none"
        className="!w-[calc(var(--sidebar-width-icon)_+_1px)] border-r"
      >
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size="lg" asChild className="md:h-8 md:p-0">
                <Link href="/home">
                  <div className="flex aspect-square size-8 items-center justify-center gap-8 rounded-lg">
                    <Image
                      src="/static/images/icons/lophura-light.svg"
                      alt="Lophura"
                      width={32}
                      height={32}
                      className="hidden h-8 w-8 dark:block md:h-6 md:w-6"
                    />
                    <Image
                      src="/static/images/icons/lophura-dark.svg"
                      alt="Lophura"
                      width={32}
                      height={32}
                      className="block h-8 w-8 dark:hidden md:h-6 md:w-6"
                    />
                  </div>
                  <div className="flex items-center text-left leading-tight">
                    <span className="truncate font-grotesque text-lg font-medium md:text-base">
                      Lophura
                    </span>
                  </div>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent className="px-1.5 md:px-0">
              <SidebarMenu>
                {data.navMain.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      tooltip={{
                        children: item.title,
                        hidden: false,
                      }}
                      onClick={() => {
                        setActiveItem(item);
                        setOpen(true);
                        (store.getActions() as StoreActions).setCurrentRoute(
                          item.title,
                        );
                        router.push(item.url);
                      }}
                      isActive={activeItem.title === item.title}
                      className="px-2.5 md:px-2"
                    >
                      <item.icon />
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          {isMobile ? <NavUser /> : <SidebarTrigger className="mb-4" />}
        </SidebarFooter>
      </Sidebar>
      <Sidebar collapsible="none" className="hidden flex-1 md:flex">
        <SidebarHeader className="gap-3.5 border-b p-4">
          <div className="flex w-full items-center justify-between">
            <div className="text-base font-medium text-foreground">
              {currentRoute}
            </div>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup className="h-full px-0">
            <SidebarGroupContent className="flex flex-col">
              <div className="flex flex-col gap-1 px-4">
                {secondaryNav[(currentRoute! as string) || "Home"]?.map(
                  (item) => (
                    <Button
                      key={item.name}
                      variant={
                        pathname.startsWith(item.url) ? "secondary" : "ghost"
                      }
                      className="flex justify-start gap-2"
                      onClick={() => {
                        router.push(item.url);
                      }}
                    >
                      <item.icon />
                      <span>{item.name}</span>
                    </Button>
                  ),
                )}
              </div>
              <footer className="absolute bottom-0 w-full">
                <NavUser desktop />
              </footer>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
    </Sidebar>
  );
}
