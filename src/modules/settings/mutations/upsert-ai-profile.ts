"use server";

import { db } from "@/db";
import { userSettings } from "@/db/schema";
import { requireAuth } from "@/modules/auth/utils";

type UpsertAiProfileInput = {
  aiDisplayName: string | null;
  aiRole: string | null;
  aiAbout: string | null;
  aiWorkStyle: string | null;
};

export async function upsertAiProfile(
  input: UpsertAiProfileInput,
): Promise<void> {
  const session = await requireAuth();
  const userId = session.id;

  await db
    .insert(userSettings)
    .values({ userId, ...input })
    .onConflictDoUpdate({
      target: userSettings.userId,
      set: { ...input, updatedAt: new Date() },
    });
}
