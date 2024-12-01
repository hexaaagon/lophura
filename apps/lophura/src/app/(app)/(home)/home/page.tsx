"use client";
import { useState } from "react";
import {
  Construction,
  Eye,
  EyeClosed,
  EyeOff,
  FolderOpen,
  Plus,
  Upload,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { StoreType } from "@/lib/store";
import { useStoreState } from "easy-peasy";
import { ExtensionIcon } from "@/components/ExtensionIcon";

export default function Home() {
  const [showSuggested, setShowSuggested] = useState(true);
  const data = useStoreState((state: StoreType) => state);

  return (
    <main className="flex flex-col gap-4">
      <section className="grid w-full grid-cols-2 gap-4 sm:grid-cols-3 lg:w-3/4 xl:grid-cols-4 2xl:w-1/2">
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
      </section>
      <section>
        <div className="flex items-center gap-1">
          <span
            className={`font-medium ${showSuggested ? "" : "text-muted-foreground"}`}
          >
            Suggested for you
          </span>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowSuggested((show) => !show)}
          >
            {showSuggested ? (
              <Eye className="h-4 w-4" />
            ) : (
              <EyeOff className="h-4 w-4" />
            )}
          </Button>
        </div>
        {showSuggested && (
          <div>
            {/*suggestedFiles.map((file) => (
              <div key={file.id} className="flex items-center gap-1">
                {file.type === "folder" ? (
                  <FolderOpen className="h-4 w-4" />
                ) : (
                  <ExtensionIcon ext={file.extension} className="h-4 w-4" />
                )}
                <span>{file.name}</span>
              </div>
            ))*/}
          </div>
        )}
      </section>
    </main>
  );
}
