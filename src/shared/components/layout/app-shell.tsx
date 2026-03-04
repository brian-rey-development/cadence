"use client";

import { useState } from "react";
import CreateTaskSheet from "@/modules/tasks/components/create-task-sheet";
import InstallPrompt from "@/shared/components/common/install-prompt";
import OfflineBanner from "@/shared/components/common/offline-banner";
import BottomNav from "./bottom-nav";

type AppShellProps = {
  children: React.ReactNode;
};

export default function AppShell({ children }: AppShellProps) {
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  return (
    <div className="relative flex min-h-svh flex-col bg-[var(--color-bg-base)]">
      <OfflineBanner />
      <InstallPrompt />
      <main className="flex-1 overflow-y-auto pb-[64px]">{children}</main>
      <BottomNav onPlusClick={() => setIsCreateOpen(true)} />
      <CreateTaskSheet
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
      />
    </div>
  );
}
