"use client";

import { AnimatePresence, motion } from "framer-motion";

type SheetProps = {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
};

const EASING = [0.25, 0, 0, 1] as const;

export default function Sheet({ open, onClose, title, children }: SheetProps) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 z-[55]"
            style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: EASING }}
            onClick={onClose}
          />
          <motion.div
            className="fixed bottom-0 left-0 right-0 z-[60] rounded-t-[20px] px-4 pb-8 pt-5 bg-bg-surface"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ duration: 0.35, ease: EASING }}
          >
            <div
              className="mx-auto mb-4 h-1 w-10 rounded-full"
              style={{ backgroundColor: "var(--color-border-subtle)" }}
            />
            {title && (
              <h2
                className="mb-5 text-base font-medium font-body text-text-primary"
              >
                {title}
              </h2>
            )}
            {children}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
