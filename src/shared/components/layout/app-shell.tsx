"use client";

import { useState } from "react";
import CreateTaskSheet from "@/modules/tasks/components/create-task-sheet";
import BottomNav from "./bottom-nav";

type AppShellProps = {
  children: React.ReactNode;
};

export default function AppShell({ children }: AppShellProps) {
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  return (
    <div className="relative flex min-h-svh flex-col bg-[var(--color-bg-base)]">
      <main className="flex-1 overflow-y-auto pb-[64px]">{children}</main>
      <BottomNav onPlusClick={() => setIsCreateOpen(true)} />
      <CreateTaskSheet
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
      />
    </div>
  );
}
