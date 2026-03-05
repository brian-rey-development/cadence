"use client";

import { X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const SESSION_KEY = "install-prompt-shown";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

export default function InstallPrompt() {
  const [visible, setVisible] = useState(false);
  const promptRef = useRef<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    if (sessionStorage.getItem(SESSION_KEY)) return;

    const handler = (e: Event) => {
      e.preventDefault();
      promptRef.current = e as BeforeInstallPromptEvent;
      sessionStorage.setItem(SESSION_KEY, "1");
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
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed right-0 bottom-20 left-0 z-40 px-4">
      <div className="rounded-xl bg-[var(--color-bg-elevated)] p-4">
        <div className="mb-1 flex items-start justify-between gap-3">
          <p className="font-body text-sm font-medium text-text-primary">
            Install Cadence for the best experience
          </p>
          <button
            type="button"
            onClick={dismiss}
            aria-label="Dismiss"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-text-secondary"
          >
            <X size={16} strokeWidth={1.5} />
          </button>
        </div>
        <p className="mb-3 font-body text-xs text-text-secondary">
          Faster load times, offline access, and push reminders - works like a native app.
        </p>
        <button
          type="button"
          onClick={handleAdd}
          className="w-full rounded-lg bg-[var(--color-interactive-primaryBg)] py-2.5 font-body text-sm font-medium text-[var(--color-interactive-primaryText)]"
        >
          Add to Home Screen
        </button>
      </div>
    </div>
  );
}
