"use client";

import { motion } from "framer-motion";
import { getGreeting } from "@/shared/utils/greeting";

const EASING = [0.25, 0, 0, 1] as const;

type GreetingTextProps = {
  displayName: string;
};

export default function GreetingText({ displayName }: GreetingTextProps) {
  const hour = new Date().getHours();
  const greeting = getGreeting(hour);
  const words = `${greeting}, ${displayName}`.split(" ");

  return (
    <h1
      className="font-display text-3xl text-text-primary"
      aria-label={`${greeting}, ${displayName}`}
    >
      {words.map((word, i) => (
        <motion.span
          key={i}
          className="inline-block"
          style={{ marginRight: "0.25em" }}
          initial={{ opacity: 0, y: 10, filter: "blur(6px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{
            duration: 0.5,
            delay: i * 0.1,
            ease: EASING,
          }}
        >
          {word}
        </motion.span>
      ))}
    </h1>
  );
}
