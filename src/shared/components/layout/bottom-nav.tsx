"use client";

import { CalendarDays, Flame, Plus, Settings, Sun, Target } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/shared/utils/cn";

type NavTab = {
  href: string;
  label: string;
  Icon: React.FC<{ size: number; strokeWidth: number; className?: string }>;
};

const LEFT_TABS: NavTab[] = [
  { href: "/today", label: "Today", Icon: Sun },
  { href: "/week", label: "Week", Icon: CalendarDays },
];

const RIGHT_TABS: NavTab[] = [
  { href: "/habits", label: "Habits", Icon: Flame },
  { href: "/quarter", label: "Quarter", Icon: Target },
  { href: "/settings", label: "Settings", Icon: Settings },
];

type TabItemProps = {
  tab: NavTab;
  isActive: boolean;
};

function TabItem({ tab, isActive }: TabItemProps) {
  return (
    <Link
      href={tab.href}
      aria-current={isActive ? "page" : undefined}
      className="flex min-h-[44px] flex-1 flex-col items-center justify-center gap-0.5 transition-colors duration-[150ms] ease-[cubic-bezier(0.25,0,0,1)]"
    >
      <tab.Icon
        size={20}
        strokeWidth={1.5}
        className={cn(
          "transition-colors duration-[150ms]",
          isActive
            ? "text-[var(--color-text-primary)]"
            : "text-[var(--color-text-tertiary)]",
        )}
      />
      <span
        className={cn(
          "font-[family-name:var(--font-body)] text-[11px] font-[500] tracking-[0.01em] transition-colors duration-[150ms]",
          isActive
            ? "text-[var(--color-text-primary)]"
            : "text-[var(--color-text-tertiary)]",
        )}
      >
        {tab.label}
      </span>
    </Link>
  );
}

type BottomNavProps = {
  onPlusClick?: () => void;
};

export default function BottomNav({ onPlusClick }: BottomNavProps) {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Main navigation"
      className="fixed bottom-0 left-0 right-0 z-50 h-[64px] border-t border-[var(--color-border-subtle)] bg-[var(--color-bg-base)]/90 backdrop-blur-[12px]"
    >
      <div className="flex h-full items-center px-5">
        {LEFT_TABS.map((tab) => (
          <TabItem
            key={tab.href}
            tab={tab}
            isActive={pathname.startsWith(tab.href)}
          />
        ))}

        <div className="flex flex-1 items-center justify-center">
          <button
            type="button"
            aria-label="Add task"
            onClick={onPlusClick}
            className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--color-primary-bg)] text-[var(--color-primary-text)] shadow-[0_4px_20px_rgba(240,237,232,0.18)] transition-all duration-[150ms] ease-[cubic-bezier(0.25,0,0,1)] active:scale-95"
          >
            <Plus size={22} strokeWidth={1.5} />
          </button>
        </div>

        {RIGHT_TABS.map((tab) => (
          <TabItem
            key={tab.href}
            tab={tab}
            isActive={pathname.startsWith(tab.href)}
          />
        ))}
      </div>
    </nav>
  );
}
