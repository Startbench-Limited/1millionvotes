
-- Fix RLS policies: change conflicting restrictive policies to permissive
-- and add admin read access where missing

-- PLEDGES: Drop restrictive policies and recreate as permissive
DROP POLICY IF EXISTS "Public can view pledge counts" ON public.pledges;
DROP POLICY IF EXISTS "Users can view their own pledges" ON public.pledges;
DROP POLICY IF EXISTS "Users can create their own pledges" ON public.pledges;

CREATE POLICY "Users can view their own pledges" ON public.pledges FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own pledges" ON public.pledges FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins can view all pledges" ON public.pledges FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role));

-- PROFILES: Drop restrictive policies and recreate as permissive
DROP POLICY IF EXISTS "Public profiles are viewable" ON public.profiles;
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;

CREATE POLICY "Users can view their own profile" ON public.profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all profiles" ON public.profiles FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);

-- REFERRALS: Drop restrictive policies and recreate as permissive
DROP POLICY IF EXISTS "Users can view their own referrals" ON public.referrals;
DROP POLICY IF EXISTS "Admins can view all referrals" ON public.referrals;

CREATE POLICY "Users can view their own referrals" ON public.referrals FOR SELECT USING (auth.uid() = referrer_id);
CREATE POLICY "Admins can view all referrals" ON public.referrals FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role));

-- VOLUNTEERS: Drop restrictive policies and recreate as permissive
DROP POLICY IF EXISTS "Users can view their own tasks" ON public.volunteers;
DROP POLICY IF EXISTS "Users can update their own tasks" ON public.volunteers;
DROP POLICY IF EXISTS "Admins can manage all tasks" ON public.volunteers;

CREATE POLICY "Users can view their own tasks" ON public.volunteers FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update their own tasks" ON public.volunteers FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Admins can manage all tasks" ON public.volunteers FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- CAMPAIGN_CONTENT: Fix restrictive policies
DROP POLICY IF EXISTS "Public can view published content" ON public.campaign_content;
DROP POLICY IF EXISTS "Admins can manage all content" ON public.campaign_content;

CREATE POLICY "Public can view published content" ON public.campaign_content FOR SELECT USING (status = 'published');
CREATE POLICY "Admins can manage all content" ON public.campaign_content FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- USER_ROLES: Fix restrictive policies
DROP POLICY IF EXISTS "Users can view their own roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can view all roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can manage roles" ON public.user_roles;

CREATE POLICY "Users can view their own roles" ON public.user_roles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can manage roles" ON public.user_roles FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));
