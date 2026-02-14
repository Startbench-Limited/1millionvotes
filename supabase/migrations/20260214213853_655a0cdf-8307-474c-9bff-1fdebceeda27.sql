
-- Fix: Replace security definer view with security invoker
DROP VIEW IF EXISTS public.state_pledge_counts;
CREATE VIEW public.state_pledge_counts
WITH (security_invoker = on) AS
SELECT state, COUNT(*) as pledge_count
FROM public.pledges
WHERE status IN ('pending', 'verified')
GROUP BY state;
