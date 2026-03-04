import { eq } from "drizzle-orm";
import { db } from "@/db";
import type { UserSettingsModel } from "@/db/schema";
import { userSettings } from "@/db/schema";

export async function getUserSettings(
  userId: string,
): Promise<UserSettingsModel | undefined> {
  return db.query.userSettings.findFirst({
    where: eq(userSettings.userId, userId),
  });
}
