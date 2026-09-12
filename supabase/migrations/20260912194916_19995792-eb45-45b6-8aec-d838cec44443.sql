ALTER TABLE public.campaign_settings
  ADD COLUMN IF NOT EXISTS ward_pledge_targets jsonb NOT NULL DEFAULT '[]'::jsonb;