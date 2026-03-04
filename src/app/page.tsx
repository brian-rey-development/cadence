import { redirect } from "next/navigation";
import { createClient } from "@/shared/lib/supabase/server";

export default async function RootPage() {
  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  redirect(session ? "/today" : "/login");
}
