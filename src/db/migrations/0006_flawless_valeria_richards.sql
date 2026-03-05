ALTER TABLE "user_settings" ADD COLUMN "daily_task_limit" integer DEFAULT 7 NOT NULL;--> statement-breakpoint
ALTER TABLE "user_settings" ADD COLUMN "weekly_goal_limit" integer DEFAULT 3 NOT NULL;