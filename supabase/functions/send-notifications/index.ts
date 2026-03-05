// Sends morning/evening push notifications and expiry reminders to users.
//
// Morning: fires at user's morning_notification_time → "What are your 3 things today?"
// Evening: fires at user's evening_notification_time if day not closed → "Day not yet closed."
// Expiry: fires within 30min before a task/habit scheduled_time if not completed/logged → reminder push.
// Max 2 morning/evening notifications per day per user (tracked via last_*_sent_date).
// Expiry deduplication via reminder_logs table (entityId + sentDate unique constraint).
// Scheduled every hour via supabase/cron.sql.

import { createClient } from "npm:@supabase/supabase-js@2";
import webpush from "npm:web-push@3";

const MORNING_TITLE = "Good morning";
const MORNING_BODY = "What are your 3 things today?";
const EVENING_TITLE = "Cadence";
const EVENING_BODY = "Day not yet closed.";
const EXPIRY_WINDOW_MINUTES = 30;
const NOTIFICATION_WINDOW_MINUTES = 30;

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

type TaskRow = {
  id: string;
  title: string;
  scheduled_time: string;
  status: string;
};

type HabitRow = {
  id: string;
  name: string;
  scheduled_time: string;
};

Deno.serve(async (_req: Request) => {
  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
    const vapidPublicKey = Deno.env.get("VAPID_PUBLIC_KEY") ?? "";
    const vapidPrivateKey = Deno.env.get("VAPID_PRIVATE_KEY") ?? "";
    const vapidSubject = Deno.env.get("VAPID_SUBJECT") ?? "";

    if (
      !supabaseUrl ||
      !serviceKey ||
      !vapidPublicKey ||
      !vapidPrivateKey ||
      !vapidSubject
    ) {
      throw new Error("Missing required environment variables");
    }

    webpush.setVapidDetails(vapidSubject, vapidPublicKey, vapidPrivateKey);

    const supabase = createClient(supabaseUrl, serviceKey);

    const { data: users, error } = await supabase
      .from("user_settings")
      .select(
        "user_id, morning_enabled, evening_enabled, morning_notification_time, evening_notification_time, timezone, push_subscription, last_morning_sent_date, last_evening_sent_date",
      )
      .not("push_subscription", "is", null);

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
        isWithinWindow(
          userNow,
          user.morning_notification_time,
          NOTIFICATION_WINDOW_MINUTES,
        )
      ) {
        // biome-ignore lint/style/noNonNullAssertion: query filters push_subscription IS NOT NULL
        await sendPush(user.push_subscription!, MORNING_TITLE, MORNING_BODY);
        updates.last_morning_sent_date = todayStr;
        sent++;
      }

      if (
        user.evening_enabled &&
        user.evening_notification_time &&
        user.last_evening_sent_date !== todayStr &&
        isWithinWindow(
          userNow,
          user.evening_notification_time,
          NOTIFICATION_WINDOW_MINUTES,
        )
      ) {
        const dayClosed = await isDayClosed(supabase, user.user_id, todayStr);
        if (!dayClosed) {
          // biome-ignore lint/style/noNonNullAssertion: query filters push_subscription IS NOT NULL
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

      // push_subscription is guaranteed non-null by the `.not("push_subscription", "is", null)` filter
      if (user.push_subscription) {
        const expirySent = await sendExpiryReminders(
          supabase,
          user.user_id,
          user.push_subscription,
          userNow,
          todayStr,
        );
        sent += expirySent;
      }
    }

    return jsonResponse({ ok: true, sent });
  } catch (err) {
    return jsonResponse({ error: String(err) }, 500);
  }
});

async function sendExpiryReminders(
  supabase: ReturnType<typeof createClient>,
  userId: string,
  pushSubscription: string,
  userNow: Date,
  todayStr: string,
): Promise<number> {
  let sent = 0;

  const [pendingTasks, unloggedHabits] = await Promise.all([
    fetchPendingTasksWithTime(supabase, userId, todayStr),
    fetchUnloggedHabitsWithTime(supabase, userId, todayStr),
  ]);

  for (const task of pendingTasks) {
    if (
      !isWithinExpiryWindow(userNow, task.scheduled_time, EXPIRY_WINDOW_MINUTES)
    )
      continue;
    const alreadySent = await checkReminderLog(supabase, task.id, todayStr);
    if (alreadySent) continue;

    await sendPush(
      pushSubscription,
      task.title,
      `Due at ${formatDisplayTime(task.scheduled_time)} — don't forget!`,
    );
    await insertReminderLog(supabase, userId, "task", task.id, todayStr);
    sent++;
  }

  for (const habit of unloggedHabits) {
    if (
      !isWithinExpiryWindow(
        userNow,
        habit.scheduled_time,
        EXPIRY_WINDOW_MINUTES,
      )
    )
      continue;
    const alreadySent = await checkReminderLog(supabase, habit.id, todayStr);
    if (alreadySent) continue;

    await sendPush(
      pushSubscription,
      habit.name,
      `Due at ${formatDisplayTime(habit.scheduled_time)} — don't forget!`,
    );
    await insertReminderLog(supabase, userId, "habit", habit.id, todayStr);
    sent++;
  }

  return sent;
}

async function fetchPendingTasksWithTime(
  supabase: ReturnType<typeof createClient>,
  userId: string,
  date: string,
): Promise<TaskRow[]> {
  const { data } = await supabase
    .from("tasks")
    .select("id, title, scheduled_time, status")
    .eq("user_id", userId)
    .eq("date", date)
    .not("scheduled_time", "is", null)
    .eq("status", "pending");
  return (data ?? []) as TaskRow[];
}

async function fetchUnloggedHabitsWithTime(
  supabase: ReturnType<typeof createClient>,
  userId: string,
  date: string,
): Promise<HabitRow[]> {
  const { data: habits } = await supabase
    .from("habits")
    .select("id, name, scheduled_time")
    .eq("user_id", userId)
    .is("archived_at", null)
    .not("scheduled_time", "is", null);

  if (!habits?.length) return [];

  const habitIds = habits.map((h: HabitRow) => h.id);
  const { data: logs } = await supabase
    .from("habit_logs")
    .select("habit_id")
    .eq("user_id", userId)
    .eq("date", date)
    .in("habit_id", habitIds);

  const loggedIds = new Set(
    (logs ?? []).map((l: { habit_id: string }) => l.habit_id),
  );
  return (habits as HabitRow[]).filter((h) => !loggedIds.has(h.id));
}

async function checkReminderLog(
  supabase: ReturnType<typeof createClient>,
  entityId: string,
  sentDate: string,
): Promise<boolean> {
  const { data } = await supabase
    .from("reminder_logs")
    .select("id")
    .eq("entity_id", entityId)
    .eq("sent_date", sentDate)
    .maybeSingle();
  return data !== null;
}

async function insertReminderLog(
  supabase: ReturnType<typeof createClient>,
  userId: string,
  entityType: "task" | "habit",
  entityId: string,
  sentDate: string,
): Promise<void> {
  await supabase.from("reminder_logs").insert({
    user_id: userId,
    entity_type: entityType,
    entity_id: entityId,
    sent_date: sentDate,
  });
}

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

// For expiry: only trigger when now is BEFORE the scheduled time (approaching, not past)
function isWithinExpiryWindow(
  now: Date,
  scheduledTime: string, // "HH:MM"
  windowMinutes: number,
): boolean {
  const [targetHour, targetMinute] = scheduledTime.split(":").map(Number);
  const targetTotalMinutes = targetHour * 60 + targetMinute;
  const nowTotalMinutes = now.getHours() * 60 + now.getMinutes();
  const diff = targetTotalMinutes - nowTotalMinutes;
  return diff >= 0 && diff < windowMinutes;
}

function formatDisplayTime(time: string): string {
  const [h, m] = time.split(":").map(Number);
  const period = h >= 12 ? "pm" : "am";
  const hour = h % 12 || 12;
  return `${hour}:${m.toString().padStart(2, "0")}${period}`;
}

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}
