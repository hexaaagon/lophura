"use client";
import { Construction, FolderOpen, Plus, Upload } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { StoreType } from "@/lib/store";
import { useStoreState } from "easy-peasy";

export default function Home() {
  const data = useStoreState((state: StoreType) => state);

  return (
    <main>
      <div className="grid w-full grid-cols-2 gap-4 sm:grid-cols-3 lg:w-3/4 xl:grid-cols-4 2xl:w-1/2">
        <Button>
          <Plus /> Create
        </Button>
        <Button
          variant="outline"
          className="border-dashed hover:border-muted-foreground"
        >
          <Upload />
          <span className="flex gap-1">
            Upload
            <p className="hidden xl:block">or drop</p>
          </span>
        </Button>
        <Button variant="outline" className="hidden sm:flex">
          <FolderOpen /> New folder
        </Button>
        <Button variant="outline" className="hidden xl:flex">
          <Construction /> temp boi
        </Button>
      </div>
    </main>
  );
}
