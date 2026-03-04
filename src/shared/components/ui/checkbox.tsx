"use client";

import { motion } from "framer-motion";

const EASING = [0.25, 0, 0, 1] as const;

type CheckboxProps = {
  checked: boolean;
  onChange: () => void;
  disabled?: boolean;
};

export default function Checkbox({
  checked,
  onChange,
  disabled = false,
}: CheckboxProps) {
  return (
    <button
      type="button"
      onClick={onChange}
      disabled={disabled}
      aria-label={checked ? "Mark incomplete" : "Mark complete"}
      aria-pressed={checked}
      className="flex items-center justify-center shrink-0 w-11 h-11"
    >
      <motion.svg
        width={20}
        height={20}
        viewBox="0 0 20 20"
        fill="none"
        aria-hidden="true"
        animate={checked ? "checked" : "unchecked"}
      >
        <motion.rect
          x={1}
          y={1}
          width={18}
          height={18}
          rx={5}
          strokeWidth={1.5}
          variants={{
            unchecked: {
              stroke: "var(--color-border-subtle)",
              fill: "transparent",
            },
            checked: {
              stroke: "var(--color-brand)",
              fill: "var(--color-brand)",
            },
          }}
          transition={{ duration: 0.2, ease: EASING }}
        />
        <motion.path
          d="M5.5 10L8.5 13L14.5 7"
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
          stroke="var(--color-bg-base)"
          variants={{
            unchecked: { pathLength: 0, opacity: 0 },
            checked: { pathLength: 1, opacity: 1 },
          }}
          transition={{ duration: 0.3, ease: EASING, delay: 0.05 }}
        />
      </motion.svg>
    </button>
  );
}
