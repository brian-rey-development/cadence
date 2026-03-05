import type { SupabaseClient } from "@supabase/supabase-js";
import { sql } from "drizzle-orm";
import { NextResponse } from "next/server";
import { db } from "@/db";
import { userSettings } from "@/db/schema";
import { createClient } from "@/shared/lib/supabase/server";

async function seedDisplayName(supabase: SupabaseClient): Promise<void> {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const rawName =
      (user.user_metadata?.name as string | undefined) ??
      (user.user_metadata?.full_name as string | undefined);

    if (!rawName) return;

    await db
      .insert(userSettings)
      .values({ userId: user.id, aiDisplayName: rawName })
      .onConflictDoUpdate({
        target: userSettings.userId,
        set: {
          aiDisplayName: sql`COALESCE(${userSettings.aiDisplayName}, ${rawName})`,
          updatedAt: new Date(),
        },
      });
  } catch {
    // Non-critical: session is valid, name can be set manually in Settings
  }
}

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      void seedDisplayName(supabase);
      return NextResponse.redirect(`${origin}/today`);
    }
  }

  return NextResponse.redirect(`${origin}/login`);
}
