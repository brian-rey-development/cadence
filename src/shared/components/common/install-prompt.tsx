"use client";

import { X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const STORAGE_KEY = "install-prompt-seen";
const VISIT_COUNT_KEY = "install-prompt-visits";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

export default function InstallPrompt() {
  const [visible, setVisible] = useState(false);
  const promptRef = useRef<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    if (localStorage.getItem(STORAGE_KEY)) return;

    const visits = parseInt(localStorage.getItem(VISIT_COUNT_KEY) ?? "0", 10);
    localStorage.setItem(VISIT_COUNT_KEY, String(visits + 1));

    if (visits < 1) return;

    const handler = (e: Event) => {
      e.preventDefault();
      promptRef.current = e as BeforeInstallPromptEvent;
      setVisible(true);
    };

    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleAdd = async () => {
    if (!promptRef.current) return;
    await promptRef.current.prompt();
    await promptRef.current.userChoice;
    dismiss();
  };

  const dismiss = () => {
    localStorage.setItem(STORAGE_KEY, "1");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed right-0 bottom-20 left-0 z-40 px-4">
      <div className="rounded-xl bg-[var(--color-bg-elevated)] p-4">
        <div className="mb-3 flex items-start justify-between gap-3">
          <p className="font-['DM_Sans'] text-sm text-[var(--color-text-primary)]">
            Add Cadence to your home screen
          </p>
          <button
            type="button"
            onClick={dismiss}
            className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[var(--color-text-secondary)]"
          >
            <X size={16} strokeWidth={1.5} />
          </button>
        </div>
        <button
          type="button"
          onClick={handleAdd}
          className="w-full rounded-lg bg-[var(--color-interactive-primaryBg)] py-2.5 font-['DM_Sans'] text-sm font-medium text-[var(--color-interactive-primaryText)]"
        >
          Add to Home Screen
        </button>
      </div>
    </div>
  );
}
