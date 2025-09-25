"use client";

import { HomeIcon } from "lucide-react";
import Link from "next/link";
import { ReactNode } from "react";

export default function DashboardTopNav({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col">
      <header className="flex h-14 lg:h-[52px] items-center gap-4 border-b px-3">
        <Link
          href="/dashboard"
          className="flex items-center gap-2 font-semibold"
        >
          <HomeIcon className="h-6 w-6" />
          <span>Dashboard</span>
        </Link>
      </header>
      {children}
    </div>
  );
}
