import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export interface CampaignSettings {
  id: string;
  name: string;
  start_date: string | null;
  end_date: string | null;
  is_active: boolean;
}

export function useCampaignSettings() {
  return useQuery({
    queryKey: ["campaign-settings"],
    queryFn: async (): Promise<CampaignSettings | null> => {
      const { data, error } = await supabase
        .from("campaign_settings")
        .select("id, name, start_date, end_date, is_active")
        .order("created_at", { ascending: true })
        .limit(1)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
  });
}

export function useUpdateCampaignSettings() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (values: {
      id?: string;
      name: string;
      start_date: string | null;
      end_date: string | null;
      is_active: boolean;
    }) => {
      if (values.id) {
        const { error } = await supabase
          .from("campaign_settings")
          .update({
            name: values.name,
            start_date: values.start_date,
            end_date: values.end_date,
            is_active: values.is_active,
          })
          .eq("id", values.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("campaign_settings").insert({
          name: values.name,
          start_date: values.start_date,
          end_date: values.end_date,
          is_active: values.is_active,
        });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["campaign-settings"] });
      toast({ title: "Campaign dates saved" });
    },
    onError: (e: Error) => {
      toast({ title: "Could not save", description: e.message, variant: "destructive" });
    },
  });
}

export function formatCampaignDate(date: string | null) {
  if (!date) return "Not set";
  return new Date(`${date}T00:00:00`).toLocaleDateString("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function campaignDaysLeft(endDate: string | null) {
  if (!endDate) return null;
  const end = new Date(`${endDate}T23:59:59`).getTime();
  const diff = end - Date.now();
  return diff <= 0 ? 0 : Math.ceil(diff / 86400000);
}
