import { getDailyQuote } from "../utils/quotes";

export default function DailyQuote() {
  const { text, author } = getDailyQuote();

  return (
    <div className="flex flex-col gap-1.5">
      <p className="font-display text-base italic leading-relaxed text-text-tertiary">
        {text}
      </p>
      <span
        className="self-start rounded-full px-2 py-0.5 text-2xs font-body font-medium uppercase tracking-widest"
        style={{
          backgroundColor: "var(--color-bg-elevated)",
          color: "var(--color-text-tertiary)",
        }}
      >
        {author}
      </span>
    </div>
  );
}
