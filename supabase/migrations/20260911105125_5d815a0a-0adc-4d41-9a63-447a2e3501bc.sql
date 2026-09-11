ALTER TABLE public.campaign_settings
  ADD COLUMN IF NOT EXISTS pledge_goal integer NOT NULL DEFAULT 1000000,
  ADD COLUMN IF NOT EXISTS pledge_thresholds jsonb NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS reward_tiers jsonb NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS redemption_rules text,
  ADD COLUMN IF NOT EXISTS show_rules_publicly boolean NOT NULL DEFAULT true;