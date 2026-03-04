import { redirect } from "next/navigation";
import { createClient } from "@/shared/lib/supabase/server";

export async function requireAuth() {
  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect("/login");
  }

  return session;
}
