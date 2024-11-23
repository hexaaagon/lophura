import { checkAuth } from "@/lib/auth/utils";
import { Toaster } from "@/components/ui/sonner";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import TrpcProvider from "@/lib/trpc/Provider";
import { cookies } from "next/headers";
export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  await checkAuth();
  return (
    <main>
      <TrpcProvider cookies={cookieStore.toString()}>
        <div className="flex h-screen">
          <Sidebar />
          <main className="flex-1 overflow-y-auto p-8 pt-2 md:p-8">
            <Navbar />
            {children}
          </main>
        </div>
      </TrpcProvider>

      <Toaster richColors />
    </main>
  );
}
