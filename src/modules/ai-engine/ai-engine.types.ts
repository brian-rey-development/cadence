import type {
  AiEmbeddingModel,
  AiGoalBreakdownModel,
  AiTaskScoreModel,
  AiUserContextModel,
} from "@/db/schema";

export type AiEmbedding = AiEmbeddingModel;
export type AiTaskScore = AiTaskScoreModel;
export type AiGoalBreakdown = AiGoalBreakdownModel;
export type AiUserContext = AiUserContextModel;

export type Milestone = {
  title: string;
  targetDate: string;
  suggestedTasks: string[];
  weekOffset: number;
};

export type TaskScore = {
  taskId: string;
  impactScore: number;
  urgencyScore: number;
  opportunityCost: string[];
  reasoning: string;
};

export type UserContext = {
  userId: string;
  snapshot: string;
  computedAt: Date;
};
