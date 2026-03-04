// TODO: deploy via supabase functions deploy send-notifications
// Sends morning/evening push notifications to users based on their settings.
//
// Morning: fires at user's morning_notification_time, text "What are your 3 things today?"
// Evening: fires at user's evening_notification_time if day not closed, text "Day not yet closed."
// Max 2 notifications per day per user. No sound by default.

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

serve(async (_req: Request) => {
  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";

    if (!supabaseUrl || !serviceKey) {
      throw new Error("Missing required environment variables");
    }

    // TODO: implement user query + push notification sending
    // 1. Query user_settings for users with notifications enabled
    // 2. Check if current time matches their notification window (within 5 min)
    // 3. For evening: check daily_reviews table to see if day is closed
    // 4. Send Web Push notification via push subscription stored in user_settings

    return new Response(JSON.stringify({ ok: true }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});
