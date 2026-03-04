ALTER TABLE "user_settings" ADD COLUMN IF NOT EXISTS "push_subscription" text;--> statement-breakpoint
ALTER TABLE "user_settings" ADD COLUMN IF NOT EXISTS "last_morning_sent_date" text;--> statement-breakpoint
ALTER TABLE "user_settings" ADD COLUMN IF NOT EXISTS "last_evening_sent_date" text;