CREATE TABLE "ai_embeddings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"entity_type" text NOT NULL,
	"entity_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"embedding" vector(768) NOT NULL,
	"content" text NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "ai_embeddings_entity_unique" UNIQUE("entity_id","entity_type")
);
--> statement-breakpoint
ALTER TABLE "ai_embeddings" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "ai_goal_breakdowns" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"goal_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"milestones" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"computed_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "ai_goal_breakdowns_goal_id_unique" UNIQUE("goal_id")
);
--> statement-breakpoint
ALTER TABLE "ai_goal_breakdowns" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "ai_task_scores" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"task_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"impact_score" numeric(3, 2) NOT NULL,
	"urgency_score" numeric(3, 2) NOT NULL,
	"opportunity_cost" uuid[] DEFAULT '{}' NOT NULL,
	"reasoning" text NOT NULL,
	"computed_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "ai_task_scores_task_id_unique" UNIQUE("task_id")
);
--> statement-breakpoint
ALTER TABLE "ai_task_scores" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "ai_user_context" (
	"user_id" uuid PRIMARY KEY NOT NULL,
	"snapshot" text NOT NULL,
	"computed_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "ai_user_context" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "ai_goal_breakdowns" ADD CONSTRAINT "ai_goal_breakdowns_goal_id_goals_id_fk" FOREIGN KEY ("goal_id") REFERENCES "public"."goals"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ai_task_scores" ADD CONSTRAINT "ai_task_scores_task_id_tasks_id_fk" FOREIGN KEY ("task_id") REFERENCES "public"."tasks"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "ai_embeddings_user_id_idx" ON "ai_embeddings" USING btree ("user_id");