"use client";
import Image from "next/image";

export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="flex flex-col items-center justify-center gap-2">
        <div className="flex flex-col items-center">
          <Image
            src="/static/images/icons/lophura-text-dark.svg"
            alt="Lophura"
            width={150}
            height={48}
            className="mb-2 block animate-pulse dark:hidden"
          />
          <Image
            src="/static/images/icons/lophura-text-light.svg"
            alt="Lophura"
            width={150}
            height={48}
            className="mb-2 hidden animate-pulse dark:block"
          />
        </div>
      </div>
    </div>
  );
}
