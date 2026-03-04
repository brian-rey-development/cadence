"use client";

import { motion } from "framer-motion";
import { X } from "lucide-react";
import { usePushPermission } from "../hooks/use-push-permission";

const EASING = [0.25, 0, 0, 1] as const;

type NotificationPermissionPromptProps = {
  onDismiss: () => void;
};

export default function NotificationPermissionPrompt({
  onDismiss,
}: NotificationPermissionPromptProps) {
  const { permission, requestPermission } = usePushPermission();

  if (permission === "granted" || permission === "denied") return null;

  async function handleEnable() {
    await requestPermission();
    onDismiss();
  }

  return (
    <motion.div
      className="fixed bottom-[64px] left-0 right-0 z-40 mx-auto max-w-lg px-4 pb-4"
      initial={{ y: "120%" }}
      animate={{ y: 0 }}
      exit={{ y: "120%" }}
      transition={{ duration: 0.4, ease: EASING }}
    >
      <div className="flex flex-col gap-3 rounded-2xl bg-[var(--color-bg-elevated)] p-5">
        <div className="flex items-start justify-between gap-3">
          <p className="font-[family-name:var(--font-body)] text-sm text-[var(--color-text-secondary)]">
            Get reminded to close your day and start fresh
          </p>
          <button
            type="button"
            aria-label="Dismiss"
            onClick={onDismiss}
            className="flex h-[44px] w-[44px] shrink-0 items-center justify-center rounded-full text-[var(--color-text-tertiary)] transition-colors hover:bg-white/5"
          >
            <X size={18} strokeWidth={1.5} />
          </button>
        </div>
        <button
          type="button"
          onClick={handleEnable}
          className="flex h-[44px] items-center justify-center rounded-xl bg-[var(--color-primary-bg)] font-[family-name:var(--font-body)] text-sm font-medium text-[var(--color-primary-text)] transition-opacity active:opacity-80"
        >
          Enable Notifications
        </button>
      </div>
    </motion.div>
  );
}
