"use client";

import { useQuery } from "@tanstack/react-query";
import { today } from "@/shared/utils/date";

type DailyQuoteData = {
  quote: string;
  theme: string;
  date: string;
  cached: boolean;
};

const MS_PER_DAY = 24 * 60 * 60 * 1000;

export function useDailyQuote() {
  const date = today();

  return useQuery<DailyQuoteData>({
    queryKey: ["daily-quote", date],
    queryFn: async () => {
      const res = await fetch("/api/ai/daily-quote");
      if (!res.ok) throw new Error("Failed to fetch daily quote");
      return res.json();
    },
    staleTime: MS_PER_DAY,
    retry: false,
  });
}
