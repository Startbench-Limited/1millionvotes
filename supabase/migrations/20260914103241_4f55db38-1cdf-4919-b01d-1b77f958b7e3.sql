-- Admins can verify / correct / remove pledges
CREATE POLICY "Admins can update pledges" ON public.pledges
  FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete pledges" ON public.pledges
  FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Admins can adjust member profiles (e.g. reward token corrections)
CREATE POLICY "Admins can update profiles" ON public.profiles
  FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Admins can create volunteer tasks for any member
CREATE POLICY "Admins can view all volunteer tasks" ON public.volunteers
  FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

GRANT UPDATE, DELETE ON public.pledges TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.volunteers TO authenticated;
GRANT SELECT, UPDATE ON public.profiles TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.user_roles TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.rewards TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.redemptions TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.campaign_content TO authenticated;