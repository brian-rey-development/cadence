"use server";

import { env } from "@/shared/config/env";
import { createClient } from "@/shared/lib/supabase/server";

type SignUpResult = { success: true } | { success: false; error: string };

export async function signUp(
  email: string,
  password: string,
  name: string,
): Promise<SignUpResult> {
  const supabase = await createClient();
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { name },
      emailRedirectTo: `${env.appUrl}/auth/callback`,
    },
  });

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true };
}
