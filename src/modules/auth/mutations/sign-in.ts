"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/shared/lib/supabase/server";

type SignInResult = { success: false; error: string };

export async function signIn(
  email: string,
  password: string,
): Promise<SignInResult> {
  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { success: false, error: error.message };
  }

  redirect("/today");
}
