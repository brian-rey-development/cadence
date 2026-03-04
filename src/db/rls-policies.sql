-- Cadence RLS Policies
-- Run this in your Supabase SQL editor after db:push.
-- All tables already have RLS enabled via Drizzle's .enableRLS().
-- These policies restrict every operation to the authenticated user's own rows.

-- ─── goals ──────────────────────────────────────────────────────────────────

ALTER TABLE goals ADD CONSTRAINT goals_user_id_fk
  FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

CREATE POLICY "goals: users manage own rows"
  ON goals FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ─── tasks ──────────────────────────────────────────────────────────────────

ALTER TABLE tasks ADD CONSTRAINT tasks_user_id_fk
  FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

CREATE POLICY "tasks: users manage own rows"
  ON tasks FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ─── habits ─────────────────────────────────────────────────────────────────

ALTER TABLE habits ADD CONSTRAINT habits_user_id_fk
  FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

CREATE POLICY "habits: users manage own rows"
  ON habits FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ─── habit_logs ─────────────────────────────────────────────────────────────

ALTER TABLE habit_logs ADD CONSTRAINT habit_logs_user_id_fk
  FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

CREATE POLICY "habit_logs: users manage own rows"
  ON habit_logs FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ─── daily_reviews ──────────────────────────────────────────────────────────

ALTER TABLE daily_reviews ADD CONSTRAINT daily_reviews_user_id_fk
  FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

CREATE POLICY "daily_reviews: users manage own rows"
  ON daily_reviews FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ─── weekly_reviews ─────────────────────────────────────────────────────────

ALTER TABLE weekly_reviews ADD CONSTRAINT weekly_reviews_user_id_fk
  FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

CREATE POLICY "weekly_reviews: users manage own rows"
  ON weekly_reviews FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ─── user_settings ──────────────────────────────────────────────────────────

ALTER TABLE user_settings ADD CONSTRAINT user_settings_user_id_fk
  FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

CREATE POLICY "user_settings: users manage own rows"
  ON user_settings FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ─── ai_embeddings ───────────────────────────────────────────────────────────

ALTER TABLE ai_embeddings ADD CONSTRAINT ai_embeddings_user_id_fk
  FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

CREATE POLICY "ai_embeddings: users manage own rows"
  ON ai_embeddings FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ─── ai_task_scores ──────────────────────────────────────────────────────────

ALTER TABLE ai_task_scores ADD CONSTRAINT ai_task_scores_user_id_fk
  FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

CREATE POLICY "ai_task_scores: users manage own rows"
  ON ai_task_scores FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ─── ai_goal_breakdowns ──────────────────────────────────────────────────────

ALTER TABLE ai_goal_breakdowns ADD CONSTRAINT ai_goal_breakdowns_user_id_fk
  FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

CREATE POLICY "ai_goal_breakdowns: users manage own rows"
  ON ai_goal_breakdowns FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ─── ai_user_context ─────────────────────────────────────────────────────────

ALTER TABLE ai_user_context ADD CONSTRAINT ai_user_context_user_id_fk
  FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

CREATE POLICY "ai_user_context: users manage own rows"
  ON ai_user_context FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ─── pgvector setup (run once) ───────────────────────────────────────────────
-- CREATE EXTENSION IF NOT EXISTS vector;
-- After migration, add IVFFlat index for fast similarity search:
-- CREATE INDEX ON ai_embeddings USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);
