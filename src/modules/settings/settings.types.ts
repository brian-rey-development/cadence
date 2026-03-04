import type { UserSettingsModel } from "@/db/schema";

export type UserSettings = UserSettingsModel;
export type NewUserSettings = Omit<
  UserSettingsModel,
  "createdAt" | "updatedAt"
>;
