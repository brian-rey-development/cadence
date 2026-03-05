CREATE TABLE "reminder_logs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"entity_type" text NOT NULL,
	"entity_id" uuid NOT NULL,
	"sent_date" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "reminder_logs_entity_id_sent_date_unique" UNIQUE("entity_id","sent_date")
);
--> statement-breakpoint
ALTER TABLE "reminder_logs" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "habits" ADD COLUMN "scheduled_time" text;--> statement-breakpoint
ALTER TABLE "tasks" ADD COLUMN "scheduled_time" text;--> statement-breakpoint
ALTER TABLE "user_settings" ADD COLUMN "close_day_after_hour" integer DEFAULT 18 NOT NULL;