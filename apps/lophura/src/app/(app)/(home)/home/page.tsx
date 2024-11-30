"use client";
import { useMemo } from "react";

import SignOutBtn from "@/components/auth/SignOutBtn";

import { StoreType } from "@/lib/store";
import { useStoreState } from "easy-peasy";

import { trpc } from "@/lib/trpc/client";

export default function Home() {
  const computer = trpc.computers.getComputers.useQuery();
  const data = useStoreState((state: StoreType) => state);

  return (
    <main>
      <h1 className="mb-4 text-2xl font-bold">Profile</h1>
      <pre className="my-2 rounded-lg bg-secondary p-4">
        {JSON.stringify(data, null, 2)}
      </pre>
      <pre className="my-2 rounded-lg bg-secondary p-4">
        {JSON.stringify(computer, null, 2)}
      </pre>
      <SignOutBtn />
    </main>
  );
}
