"use client";
import { StoreType } from "@/lib/store";
import { useStoreState } from "easy-peasy";

export default function Home() {
  const data = useStoreState((state: StoreType) => state);

  return (
    <main>
      <h1 className="mb-4 text-2xl font-bold">Profile</h1>
      <pre className="my-2 rounded-lg bg-secondary p-4">
        {JSON.stringify(data, null, 2)}
      </pre>
    </main>
  );
}
