"use client";

import { Smartphone } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import BottomSheet from "@/shared/components/ui/bottom-sheet";

const SESSION_KEY = "install-prompt-shown";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

export default function InstallPrompt() {
  const [isOpen, setIsOpen] = useState(false);
  const promptRef = useRef<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    if (sessionStorage.getItem(SESSION_KEY)) return;

    const handler = (e: Event) => {
      e.preventDefault();
      promptRef.current = e as BeforeInstallPromptEvent;
      sessionStorage.setItem(SESSION_KEY, "1");
      setIsOpen(true);
    };

    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleAdd = async () => {
    if (!promptRef.current) return;
    await promptRef.current.prompt();
    await promptRef.current.userChoice;
    setIsOpen(false);
  };

  return (
    <BottomSheet isOpen={isOpen} onClose={() => setIsOpen(false)}>
      <div className="flex flex-col items-center gap-5 py-2">
        <div
          className="flex h-16 w-16 items-center justify-center rounded-2xl"
          style={{ backgroundColor: "var(--color-bg-subtle)" }}
        >
          <Smartphone
            size={28}
            strokeWidth={1.5}
            className="text-text-secondary"
          />
        </div>

        <div className="text-center">
          <h2 className="font-display text-xl text-text-primary mb-1">
            Install Cadence
          </h2>
          <p className="font-body text-sm text-text-secondary leading-relaxed">
            Add to your home screen for faster load times, offline access, and
            push reminders - works like a native app.
          </p>
        </div>

        <div className="flex w-full flex-col gap-3 pt-1">
          <button
            type="button"
            onClick={handleAdd}
            className="w-full rounded-xl py-3.5 font-body text-base font-medium transition-opacity active:opacity-80"
            style={{
              backgroundColor: "var(--color-interactive-primaryBg)",
              color: "var(--color-interactive-primaryText)",
            }}
          >
            Add to Home Screen
          </button>
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="w-full rounded-xl py-3.5 font-body text-base text-text-secondary transition-opacity active:opacity-80"
            style={{ backgroundColor: "var(--color-bg-subtle)" }}
          >
            Not now
          </button>
        </div>
      </div>
    </BottomSheet>
  );
}
