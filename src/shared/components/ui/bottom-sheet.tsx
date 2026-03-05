"use client";

import { AnimatePresence, motion, useDragControls } from "framer-motion";
import { X } from "lucide-react";

const EASING = [0.25, 0, 0, 1] as const;
const DISMISS_THRESHOLD = 100;

type BottomSheetProps = {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
};

export default function BottomSheet({
  isOpen,
  onClose,
  title,
  children,
}: BottomSheetProps) {
  const controls = useDragControls();

  function handleDragEnd(_: unknown, info: { offset: { y: number } }) {
    if (info.offset.y > DISMISS_THRESHOLD) onClose();
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            key="backdrop"
            className="fixed inset-0 z-[55]"
            style={{ backgroundColor: "var(--color-backdrop)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: EASING }}
            onClick={onClose}
          />

          <motion.div
            key="sheet"
            className="fixed bottom-0 left-0 right-0 z-[60] flex flex-col rounded-t-[var(--radius-sheet)]"
            style={{
              backgroundColor: "var(--color-bg-elevated)",
              maxHeight: "90svh",
            }}
            drag="y"
            dragControls={controls}
            dragListener={false}
            dragConstraints={{ top: 0 }}
            dragElastic={0.1}
            onDragEnd={handleDragEnd}
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ duration: 0.4, ease: EASING }}
          >
            <div
              className="flex items-center justify-between px-5 pt-4 pb-3"
              onPointerDown={(e) => controls.start(e)}
            >
              <div className="absolute left-1/2 top-2 h-1 w-10 -translate-x-1/2 rounded-full bg-[var(--color-border-subtle)]" />

              {title && (
                <h2 className="font-display text-lg text-text-primary">
                  {title}
                </h2>
              )}

              <button
                type="button"
                aria-label="Close"
                onClick={onClose}
                className="ml-auto flex h-8 w-8 items-center justify-center rounded-full text-text-tertiary transition-colors hover:bg-white/5"
              >
                <X size={18} strokeWidth={1.5} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-5 pb-8">{children}</div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
