"use server";

import { env } from "@/shared/config/env";
import { createClient } from "@/shared/lib/supabase/server";

type SendMagicLinkResult =
  | { success: true }
  | { success: false; error: string };

export async function sendMagicLink(
  email: string,
): Promise<SendMagicLinkResult> {
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${env.appUrl}/auth/callback`,
    },
  });

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true };
}
