-- Run once in the Supabase SQL editor to schedule push notifications.
-- Requires pg_cron to be enabled (it is on all Supabase projects by default).
-- Replace <YOUR_PROJECT_REF> and <YOUR_ANON_KEY> with your actual values.

select cron.schedule(
  'send-push-notifications',
  '0 * * * *',
  $$
    select net.http_post(
      url    := 'https://<YOUR_PROJECT_REF>.supabase.co/functions/v1/send-notifications',
      headers := jsonb_build_object(
        'Content-Type',  'application/json',
        'Authorization', 'Bearer <YOUR_ANON_KEY>'
      ),
      body   := '{}'::jsonb
    );
  $$
);

-- To verify it's scheduled:
-- select * from cron.job;

-- To remove it:
-- select cron.unschedule('send-push-notifications');
