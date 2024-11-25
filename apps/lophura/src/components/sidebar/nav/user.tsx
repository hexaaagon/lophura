"use client";

import {
  BadgeCheck,
  Bell,
  ChevronsUpDown,
  CreditCard,
  LogOut,
  Sparkles,
} from "lucide-react";
import { useEffect } from "react";

import { trpc } from "@/lib/trpc/client";
import { useStoreState } from "easy-peasy";
import { StoreType } from "@/lib/store";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";

export function NavUser() {
  const user = useStoreState((state: StoreType) => state.user!);
  const avatar = trpc.auth.getAvatar.useQuery();
  const utils = trpc.useUtils();

  const { isMobile } = useSidebar();

  useEffect(() => {
    utils.auth.getAvatar.refetch();
  }, [user]);

  const UserAvatar = () => (
    <Avatar className="h-8 w-8 rounded-lg">
      <AvatarImage src={avatar.data} alt={user?.name!} />
      <AvatarFallback className="rounded-lg">
        {user?.name ? (
          user.name
            .split(" ")
            .map((s) => s.split("")[0])
            .join("")
        ) : (
          <Skeleton className="h-4 w-4" />
        )}
      </AvatarFallback>
    </Avatar>
  );

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <UserAvatar />
              <div className="grid flex-1 text-left text-sm leading-tight">
                {user?.name ? (
                  <span className="truncate font-semibold">{user.name}</span>
                ) : (
                  <Skeleton className="mb-2 h-4 w-20" />
                )}
                {user?.email ? (
                  <span className="truncate text-xs">{user.email}</span>
                ) : (
                  <Skeleton className="h-3 w-20" />
                )}
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <UserAvatar />
                <div className="grid flex-1 text-left text-sm leading-tight">
                  {user?.name ? (
                    <span className="truncate font-semibold">{user.name}</span>
                  ) : (
                    <Skeleton className="mb-2 h-4 w-20" />
                  )}
                  {user?.email ? (
                    <span className="truncate text-xs">{user.email}</span>
                  ) : (
                    <Skeleton className="h-3 w-20" />
                  )}
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <Sparkles />
                Upgrade to Pro
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <BadgeCheck />
                Account
              </DropdownMenuItem>
              <DropdownMenuItem>
                <CreditCard />
                Billing
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Bell />
                Notifications
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <LogOut />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
