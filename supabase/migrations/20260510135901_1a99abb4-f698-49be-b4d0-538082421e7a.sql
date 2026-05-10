
-- Rewards catalog
CREATE TABLE public.rewards (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  token_cost INTEGER NOT NULL CHECK (token_cost >= 0),
  stock INTEGER,
  image_url TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.rewards ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view active rewards" ON public.rewards FOR SELECT USING (is_active = true OR has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins manage rewards" ON public.rewards FOR ALL USING (has_role(auth.uid(), 'admin'));
CREATE TRIGGER trg_rewards_updated BEFORE UPDATE ON public.rewards FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Redemptions
CREATE TABLE public.redemptions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  reward_id UUID NOT NULL REFERENCES public.rewards(id) ON DELETE RESTRICT,
  reward_name TEXT NOT NULL,
  tokens_spent INTEGER NOT NULL CHECK (tokens_spent >= 0),
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.redemptions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users view own redemptions" ON public.redemptions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins view all redemptions" ON public.redemptions FOR SELECT USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Users create own redemptions" ON public.redemptions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins manage redemptions" ON public.redemptions FOR ALL USING (has_role(auth.uid(), 'admin'));
CREATE TRIGGER trg_redemptions_updated BEFORE UPDATE ON public.redemptions FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Atomic redeem RPC: validates balance and stock, deducts tokens, decrements stock
CREATE OR REPLACE FUNCTION public.redeem_reward(_reward_id UUID)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _user UUID := auth.uid();
  _reward public.rewards%ROWTYPE;
  _balance INTEGER;
  _redemption_id UUID;
BEGIN
  IF _user IS NULL THEN RAISE EXCEPTION 'Not authenticated'; END IF;
  SELECT * INTO _reward FROM public.rewards WHERE id = _reward_id AND is_active = true FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'Reward not available'; END IF;
  IF _reward.stock IS NOT NULL AND _reward.stock <= 0 THEN RAISE EXCEPTION 'Out of stock'; END IF;
  SELECT reward_tokens INTO _balance FROM public.profiles WHERE user_id = _user FOR UPDATE;
  IF _balance IS NULL OR _balance < _reward.token_cost THEN RAISE EXCEPTION 'Insufficient tokens'; END IF;

  UPDATE public.profiles SET reward_tokens = reward_tokens - _reward.token_cost WHERE user_id = _user;
  IF _reward.stock IS NOT NULL THEN
    UPDATE public.rewards SET stock = stock - 1 WHERE id = _reward_id;
  END IF;
  INSERT INTO public.redemptions (user_id, reward_id, reward_name, tokens_spent)
    VALUES (_user, _reward_id, _reward.name, _reward.token_cost)
    RETURNING id INTO _redemption_id;
  RETURN _redemption_id;
END;
$$;

-- Notification preferences
CREATE TABLE public.notification_preferences (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  campaign_updates BOOLEAN NOT NULL DEFAULT true,
  pledge_progress BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.notification_preferences ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users view own prefs" ON public.notification_preferences FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users insert own prefs" ON public.notification_preferences FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own prefs" ON public.notification_preferences FOR UPDATE USING (auth.uid() = user_id);
CREATE TRIGGER trg_notif_prefs_updated BEFORE UPDATE ON public.notification_preferences FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Extend new-user trigger to also create notification prefs
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', 'User'));
  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'user');
  INSERT INTO public.notification_preferences (user_id) VALUES (NEW.id);
  RETURN NEW;
END;
$$;

-- Seed a few rewards
INSERT INTO public.rewards (name, description, token_cost, stock) VALUES
  ('Campaign T-Shirt', 'Official 1 Million Pledge campaign t-shirt', 500, 100),
  ('Campaign Cap', 'Branded APC Kano campaign cap', 300, 200),
  ('Mobile Airtime ₦1,000', 'Recharge credit on any Nigerian network', 800, 500),
  ('VIP Rally Access', 'Front-row access to the next campaign rally', 2000, 50);
