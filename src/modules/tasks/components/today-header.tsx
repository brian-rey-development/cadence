import { Settings } from "lucide-react";
import Link from "next/link";
import { getGreeting } from "@/shared/utils/greeting";
import type { TaskWithGoal } from "../tasks.types";
import DailyLimitBanner from "./daily-limit-banner";

type TodayHeaderProps = {
  displayName: string;
  date: string;
  tasks: TaskWithGoal[];
};

export default function TodayHeader({
  displayName,
  date,
  tasks,
}: TodayHeaderProps) {
  const hour = new Date().getHours();
  const greeting = getGreeting(hour);
  const formattedDate = new Date(`${date}T12:00:00`).toLocaleDateString(
    "en-US",
    {
      weekday: "long",
      month: "long",
      day: "numeric",
    },
  );

  return (
    <header className="flex items-start justify-between">
      <div>
        <h1 className="font-display text-3xl text-text-primary">
          {greeting}, {displayName}
        </h1>
        <p className="text-base font-body text-text-tertiary">
          {formattedDate}
        </p>
      </div>
      <div className="flex items-center gap-1">
        <DailyLimitBanner tasks={tasks} />
        <Link
          href="/settings"
          aria-label="Settings"
          className="flex min-h-11 min-w-11 items-center justify-center rounded-full transition-colors duration-150 active:bg-[var(--color-ghost-active)] text-text-tertiary"
        >
          <Settings size={20} strokeWidth={1.5} />
        </Link>
      </div>
    </header>
  );
}
