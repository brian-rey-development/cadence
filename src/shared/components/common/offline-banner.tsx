"use client";

import { useOffline } from "@/shared/hooks/use-offline";

export default function OfflineBanner() {
  const isOffline = useOffline();

  if (!isOffline) return null;

  return (
    <div
      className="fixed top-0 right-0 left-0 z-50 py-1.5 text-center font-body text-sm"
      style={{
        backgroundColor: "var(--color-warning)",
        color: "var(--color-warning-text)",
      }}
    >
      offline - ai features unavailable
    </div>
  );
}
