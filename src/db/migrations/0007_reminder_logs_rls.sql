DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'reminder_logs'
      AND policyname = 'reminder_logs: users manage own rows'
  ) THEN
    CREATE POLICY "reminder_logs: users manage own rows"
      ON "reminder_logs" FOR ALL
      USING (auth.uid() = user_id)
      WITH CHECK (auth.uid() = user_id);
  END IF;
END $$;
