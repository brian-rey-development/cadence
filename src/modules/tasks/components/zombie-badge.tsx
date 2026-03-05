import { motion } from "framer-motion";
import { Skull } from "lucide-react";

type ZombieBadgeProps = {
  daysOld: number;
};

export default function ZombieBadge({ daysOld }: ZombieBadgeProps) {
  return (
    <motion.span
      className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-sm font-mono"
      style={{
        color: "var(--color-zombie-text)",
        backgroundColor: "var(--color-zombie-pulse)",
        border: "1px solid var(--color-zombie)",
      }}
      animate={{ opacity: [1, 0.6, 1] }}
      transition={{
        duration: 2,
        repeat: Number.POSITIVE_INFINITY,
        ease: "linear",
      }}
    >
      <Skull size={12} strokeWidth={1.5} />
      {daysOld}d
    </motion.span>
  );
}
