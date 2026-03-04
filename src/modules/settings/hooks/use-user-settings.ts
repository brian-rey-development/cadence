"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { upsertUserSettings } from "../mutations/upsert-user-settings";
import type { UserSettings } from "../settings.types";

export const USER_SETTINGS_QUERY_KEY = ["user-settings"] as const;

type SaveSettingsInput = {
  morningEnabled: boolean;
  eveningEnabled: boolean;
  morningNotificationTime: string | null;
  eveningNotificationTime: string | null;
  timezone: string;
};

export function useUserSettings(initialData?: UserSettings) {
  return useQuery({
    queryKey: USER_SETTINGS_QUERY_KEY,
    queryFn: async () => initialData ?? null,
    initialData,
    staleTime: Number.POSITIVE_INFINITY,
  });
}

export function useSaveSettings() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: SaveSettingsInput) => upsertUserSettings(input),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: USER_SETTINGS_QUERY_KEY });
    },
  });
}
