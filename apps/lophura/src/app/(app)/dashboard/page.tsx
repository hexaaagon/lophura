"use client";
import SignOutBtn from "@/components/auth/SignOutBtn";
import { env } from "@/lib/env.mjs";
import { trpc } from "@/lib/trpc/client";
import { useMemo } from "react";

export default function Home() {
  const computer = trpc.computers.getComputers.useQuery();
  const session = trpc.auth.getUserAuth.useQuery();

  return (
    <main className="">
      <h1 className="my-2 text-2xl font-bold">Profile</h1>
      <pre className="my-2 rounded-lg bg-secondary p-4">
        {JSON.stringify(session, null, 2)}
      </pre>
      <pre className="my-2 rounded-lg bg-secondary p-4">
        {JSON.stringify(computer, null, 2)}
      </pre>
      <SignOutBtn />
    </main>
  );
}
