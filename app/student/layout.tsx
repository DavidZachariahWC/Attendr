import type { ReactNode } from "react";

export default function StudentLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-gray-50">
      <main className="w-full max-w-md p-6">{children}</main>
    </div>
  );
}
