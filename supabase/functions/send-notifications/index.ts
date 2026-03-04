// Sends morning/evening push notifications to users based on their settings.
//
// Morning: fires at user's morning_notification_time → "What are your 3 things today?"
// Evening: fires at user's evening_notification_time if day not closed → "Day not yet closed."
// Max 2 notifications per day per user (tracked via last_morning_sent_date / last_evening_sent_date).
// Scheduled every hour via supabase/cron.sql.

import { createClient } from "npm:@supabase/supabase-js@2";
import webpush from "npm:web-push@3";

const MORNING_TITLE = "Good morning";
const MORNING_BODY = "What are your 3 things today?";
const EVENING_TITLE = "Cadence";
const EVENING_BODY = "Day not yet closed.";
const WINDOW_MINUTES = 30;

type UserSettingsRow = {
  user_id: string;
  morning_enabled: boolean;
  evening_enabled: boolean;
  morning_notification_time: string | null;
  evening_notification_time: string | null;
  timezone: string;
  push_subscription: string | null;
  last_morning_sent_date: string | null;
  last_evening_sent_date: string | null;
};

Deno.serve(async (_req: Request) => {
  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
    const vapidPublicKey = Deno.env.get("VAPID_PUBLIC_KEY") ?? "";
    const vapidPrivateKey = Deno.env.get("VAPID_PRIVATE_KEY") ?? "";
    const vapidSubject = Deno.env.get("VAPID_SUBJECT") ?? "";

    if (!supabaseUrl || !serviceKey || !vapidPublicKey || !vapidPrivateKey || !vapidSubject) {
      throw new Error("Missing required environment variables");
    }

    webpush.setVapidDetails(vapidSubject, vapidPublicKey, vapidPrivateKey);

    const supabase = createClient(supabaseUrl, serviceKey);

    const { data: users, error } = await supabase
      .from("user_settings")
      .select(
        "user_id, morning_enabled, evening_enabled, morning_notification_time, evening_notification_time, timezone, push_subscription, last_morning_sent_date, last_evening_sent_date",
      )
      .not("push_subscription", "is", null)
      .or("morning_enabled.eq.true,evening_enabled.eq.true");

    if (error) throw error;
    if (!users?.length) {
      return jsonResponse({ ok: true, sent: 0 });
    }

    const now = new Date();
    let sent = 0;

    for (const user of users as UserSettingsRow[]) {
      const userNow = toUserLocalDate(now, user.timezone);
      const todayStr = formatDate(userNow);
      const updates: Record<string, string> = {};

      if (
        user.morning_enabled &&
        user.morning_notification_time &&
        user.last_morning_sent_date !== todayStr &&
        isWithinWindow(userNow, user.morning_notification_time, WINDOW_MINUTES)
      ) {
        await sendPush(user.push_subscription!, MORNING_TITLE, MORNING_BODY);
        updates.last_morning_sent_date = todayStr;
        sent++;
      }

      if (
        user.evening_enabled &&
        user.evening_notification_time &&
        user.last_evening_sent_date !== todayStr &&
        isWithinWindow(userNow, user.evening_notification_time, WINDOW_MINUTES)
      ) {
        const dayClosed = await isDayClosed(supabase, user.user_id, todayStr);
        if (!dayClosed) {
          await sendPush(user.push_subscription!, EVENING_TITLE, EVENING_BODY);
          updates.last_evening_sent_date = todayStr;
          sent++;
        }
      }

      if (Object.keys(updates).length > 0) {
        await supabase
          .from("user_settings")
          .update(updates)
          .eq("user_id", user.user_id);
      }
    }

    return jsonResponse({ ok: true, sent });
  } catch (err) {
    return jsonResponse({ error: String(err) }, 500);
  }
});

async function sendPush(
  subscriptionJson: string,
  title: string,
  body: string,
): Promise<void> {
  const subscription = JSON.parse(subscriptionJson);
  await webpush.sendNotification(
    subscription,
    JSON.stringify({ title, body, silent: true }),
  );
}

async function isDayClosed(
  supabase: ReturnType<typeof createClient>,
  userId: string,
  date: string,
): Promise<boolean> {
  const { data } = await supabase
    .from("daily_reviews")
    .select("id")
    .eq("user_id", userId)
    .eq("date", date)
    .maybeSingle();
  return data !== null;
}

function toUserLocalDate(utc: Date, timezone: string): Date {
  // Reconstruct a Date whose getHours()/getMinutes() reflect the user's local time
  const localStr = utc.toLocaleString("en-CA", { timeZone: timezone });
  return new Date(localStr);
}

function formatDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function isWithinWindow(
  now: Date,
  targetTime: string, // "HH:MM"
  windowMinutes: number,
): boolean {
  const [targetHour, targetMinute] = targetTime.split(":").map(Number);
  const targetTotalMinutes = targetHour * 60 + targetMinute;
  const nowTotalMinutes = now.getHours() * 60 + now.getMinutes();
  const diff = Math.abs(nowTotalMinutes - targetTotalMinutes);
  return diff < windowMinutes;
}

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}
