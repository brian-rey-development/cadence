CREATE TYPE "public"."task_type" AS ENUM('daily', 'weekly', 'quarterly');--> statement-breakpoint
CREATE TABLE "ai_daily_quotes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"date" text NOT NULL,
	"quote" text NOT NULL,
	"theme" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "ai_daily_quotes_user_date_unique" UNIQUE("user_id","date")
);
--> statement-breakpoint
ALTER TABLE "ai_daily_quotes" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "tasks" ALTER COLUMN "date" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "daily_reviews" ADD COLUMN "gratitude" text;--> statement-breakpoint
ALTER TABLE "daily_reviews" ADD COLUMN "challenges" text;--> statement-breakpoint
ALTER TABLE "daily_reviews" ADD COLUMN "learnings" text;--> statement-breakpoint
ALTER TABLE "daily_reviews" ADD COLUMN "tomorrow_focus" text;--> statement-breakpoint
ALTER TABLE "daily_reviews" ADD COLUMN "mood" text;--> statement-breakpoint
ALTER TABLE "daily_reviews" ADD COLUMN "ai_feedback" text;--> statement-breakpoint
ALTER TABLE "daily_reviews" ADD COLUMN "ai_insights" jsonb DEFAULT '[]'::jsonb;--> statement-breakpoint
ALTER TABLE "daily_reviews" ADD COLUMN "ai_next_day_focus" text;--> statement-breakpoint
ALTER TABLE "tasks" ADD COLUMN "type" "task_type" DEFAULT 'daily' NOT NULL;--> statement-breakpoint
ALTER TABLE "tasks" ADD COLUMN "week_start" text;--> statement-breakpoint
ALTER TABLE "user_settings" ADD COLUMN "ai_display_name" text;--> statement-breakpoint
ALTER TABLE "user_settings" ADD COLUMN "ai_role" text;--> statement-breakpoint
ALTER TABLE "user_settings" ADD COLUMN "ai_about" text;--> statement-breakpoint
ALTER TABLE "user_settings" ADD COLUMN "ai_work_style" text;