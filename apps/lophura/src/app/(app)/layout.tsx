import { checkAuth } from "@/lib/auth/utils";
import Navbar from "@/components/Navbar";
import { AppSidebar } from "@/components/sidebar";
import TrpcProvider from "@/lib/trpc/Provider";
import { cookies } from "next/headers";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  await checkAuth();
  return (
    <TrpcProvider cookies={cookieStore.toString()}>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset className="p-8">{children}</SidebarInset>
      </SidebarProvider>
    </TrpcProvider>
  );
}
