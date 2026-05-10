REVOKE EXECUTE ON FUNCTION public.redeem_reward(UUID) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.redeem_reward(UUID) TO authenticated;