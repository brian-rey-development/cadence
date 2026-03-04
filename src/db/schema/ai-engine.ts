import {
  customType,
  index,
  jsonb,
  numeric,
  pgTable,
  text,
  timestamp,
  unique,
  uuid,
} from "drizzle-orm/pg-core";
import { goals } from "./goals";
import { tasks } from "./tasks";

const vector = customType<{ data: number[] }>({
  dataType() {
    return "vector(768)";
  },
  fromDriver(value: unknown): number[] {
    if (typeof value === "string") {
      return value.slice(1, -1).split(",").map(Number);
    }
    return value as number[];
  },
  toDriver(value: number[]): string {
    return `[${value.join(",")}]`;
  },
});

export const ENTITY_TYPES = [
  "task",
  "goal",
  "habit",
  "daily_review",
  "weekly_review",
] as const;
export type EntityType = (typeof ENTITY_TYPES)[number];

export const aiEmbeddings = pgTable(
  "ai_embeddings",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    entityType: text("entity_type").$type<EntityType>().notNull(),
    entityId: uuid("entity_id").notNull(),
    userId: uuid("user_id").notNull(),
    embedding: vector("embedding").notNull(),
    content: text("content").notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [
    unique("ai_embeddings_entity_unique").on(t.entityId, t.entityType),
    index("ai_embeddings_user_id_idx").on(t.userId),
  ],
).enableRLS();

export const aiTaskScores = pgTable(
  "ai_task_scores",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    taskId: uuid("task_id")
      .notNull()
      .references(() => tasks.id, { onDelete: "cascade" }),
    userId: uuid("user_id").notNull(),
    impactScore: numeric("impact_score", { precision: 3, scale: 2 }).notNull(),
    urgencyScore: numeric("urgency_score", {
      precision: 3,
      scale: 2,
    }).notNull(),
    opportunityCost: uuid("opportunity_cost").array().notNull().default([]),
    reasoning: text("reasoning").notNull(),
    computedAt: timestamp("computed_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [unique("ai_task_scores_task_id_unique").on(t.taskId)],
).enableRLS();

export const aiGoalBreakdowns = pgTable(
  "ai_goal_breakdowns",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    goalId: uuid("goal_id")
      .notNull()
      .references(() => goals.id, { onDelete: "cascade" }),
    userId: uuid("user_id").notNull(),
    milestones: jsonb("milestones").notNull().default([]),
    computedAt: timestamp("computed_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [unique("ai_goal_breakdowns_goal_id_unique").on(t.goalId)],
).enableRLS();

export const aiUserContext = pgTable("ai_user_context", {
  userId: uuid("user_id").primaryKey(),
  snapshot: text("snapshot").notNull(),
  computedAt: timestamp("computed_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
}).enableRLS();

export type AiEmbeddingModel = typeof aiEmbeddings.$inferSelect;
export type AiTaskScoreModel = typeof aiTaskScores.$inferSelect;
export type AiGoalBreakdownModel = typeof aiGoalBreakdowns.$inferSelect;
export type AiUserContextModel = typeof aiUserContext.$inferSelect;
