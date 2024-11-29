"use client";

import * as React from "react";
import {
  ArchiveX,
  Command,
  File,
  Files,
  FileText,
  FileVideo,
  House,
  Inbox,
  Send,
  Server,
  Trash,
  Trash2,
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
import { useRouter } from "next/navigation";

// This is sample data
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Home",
      url: "/home",
      icon: House,
      isActive: true,
    },
    {
      title: "Workspace",
      url: "/workspace",
      icon: Server,
      isActive: false,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  // Note: I'm using state to show active item.
  // IRL you should use the url/router.
  const [activeItem, setActiveItem] = React.useState(data.navMain[0]);
  const { setOpen, isMobile } = useSidebar();

  const router = useRouter();

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
              {activeItem.title}
            </div>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup className="h-full px-0">
            <SidebarGroupContent className="flex flex-col">
              <div className="flex flex-col gap-1 px-4">
                <Button
                  variant="secondary"
                  className="flex justify-start gap-2"
                >
                  <Files />
                  <span>All Files</span>
                </Button>
                <Button variant="ghost" className="flex justify-start gap-2">
                  <FileVideo />
                  <span>Photos & Media</span>
                </Button>
                <Button variant="ghost" className="flex justify-start gap-2">
                  <FileText />
                  <span>Documents</span>
                </Button>
                <Button variant="ghost" className="flex justify-start gap-2">
                  <Trash />
                  <span>Deleted Files</span>
                </Button>
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
