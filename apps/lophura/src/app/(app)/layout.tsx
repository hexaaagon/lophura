import { checkAuth } from "@/lib/auth/utils";
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
    <TrpcProvider cookies={cookieStore.toString()}>{children}</TrpcProvider>
  );
}
