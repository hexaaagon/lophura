"use client";
import { StoreType } from "@/lib/store";
import { useStoreRehydrated, useStoreState } from "easy-peasy";

import { type ComponentProps, useEffect } from "react";

import Loading from "./loading";

import { usePathname } from "next/navigation";

export default function RootTemplate({ children }: ComponentProps<"div">) {
  const state = useStoreState((state: StoreType) => state);
  const rehydrated = useStoreRehydrated();

  return (
    <>
      {rehydrated ? (
        <>{children}</>
      ) : (
        <>
          <Loading />
        </>
      )}
    </>
  );
}
