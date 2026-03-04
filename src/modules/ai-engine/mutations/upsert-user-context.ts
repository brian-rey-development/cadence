"use server";

import { sql } from "drizzle-orm";
import { db } from "@/db";
import { aiUserContext } from "@/db/schema/ai-engine";

export async function upsertUserContext(
  userId: string,
  snapshot: string,
): Promise<void> {
  await db
    .insert(aiUserContext)
    .values({ userId, snapshot, computedAt: new Date() })
    .onConflictDoUpdate({
      target: aiUserContext.userId,
      set: {
        snapshot: sql`excluded.snapshot`,
        computedAt: sql`excluded.computed_at`,
      },
    });
}
