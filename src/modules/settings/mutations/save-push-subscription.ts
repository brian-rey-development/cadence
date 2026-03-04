"use server";

import { db } from "@/db";
import { userSettings } from "@/db/schema";
import { requireAuth } from "@/modules/auth/utils";

export async function savePushSubscription(
  subscription: PushSubscriptionJSON,
): Promise<void> {
  const session = await requireAuth();

  await db
    .insert(userSettings)
    .values({
      userId: session.id,
      pushSubscription: JSON.stringify(subscription),
    })
    .onConflictDoUpdate({
      target: userSettings.userId,
      set: {
        pushSubscription: JSON.stringify(subscription),
        updatedAt: new Date(),
      },
    });
}
