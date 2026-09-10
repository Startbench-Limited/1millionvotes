CREATE TABLE public.campaign_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL DEFAULT '1 Million Pledge Campaign',
  start_date DATE,
  end_date DATE,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

GRANT SELECT ON public.campaign_settings TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.campaign_settings TO authenticated;
GRANT ALL ON public.campaign_settings TO service_role;

ALTER TABLE public.campaign_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view campaign settings"
ON public.campaign_settings FOR SELECT
USING (true);

CREATE POLICY "Admins can manage campaign settings"
ON public.campaign_settings FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER trg_campaign_settings_updated
BEFORE UPDATE ON public.campaign_settings
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

INSERT INTO public.campaign_settings (name, start_date, end_date)
VALUES ('1 Million Pledge Campaign', CURRENT_DATE, CURRENT_DATE + INTERVAL '90 days');