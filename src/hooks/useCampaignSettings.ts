import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export interface PledgeThreshold {
  label: string;
  target: number;
}

export interface RewardTier {
  name: string;
  min_pledges: number;
  tokens: number;
}

export interface WardPledgeTarget {
  lga: string;
  ward: string;
  target: number;
}

export interface CampaignSettings {
  id: string;
  name: string;
  start_date: string | null;
  end_date: string | null;
  is_active: boolean;
  pledge_goal: number;
  pledge_thresholds: PledgeThreshold[];
  reward_tiers: RewardTier[];
  redemption_rules: string | null;
  show_rules_publicly: boolean;
  ward_pledge_targets: WardPledgeTarget[];
}

export function useCampaignSettings() {
  return useQuery({
    queryKey: ["campaign-settings"],
    queryFn: async (): Promise<CampaignSettings | null> => {
      const { data, error } = await supabase
        .from("campaign_settings")
        .select("*")
        .order("created_at", { ascending: true })
        .limit(1)
        .maybeSingle();

      if (error) throw error;
      if (!data) return null;

      const row = data as Record<string, unknown>;
      return {
        id: row.id as string,
        name: (row.name as string) ?? "",
        start_date: (row.start_date as string | null) ?? null,
        end_date: (row.end_date as string | null) ?? null,
        is_active: Boolean(row.is_active),
        pledge_goal: Number(row.pledge_goal ?? 1000000),
        pledge_thresholds: Array.isArray(row.pledge_thresholds)
          ? (row.pledge_thresholds as PledgeThreshold[])
          : [],
        reward_tiers: Array.isArray(row.reward_tiers) ? (row.reward_tiers as RewardTier[]) : [],
        redemption_rules: (row.redemption_rules as string | null) ?? null,
        show_rules_publicly: row.show_rules_publicly !== false,
        ward_pledge_targets: Array.isArray(row.ward_pledge_targets)
          ? (row.ward_pledge_targets as WardPledgeTarget[])
          : [],
      };
    },
  });
}

export interface CampaignSettingsInput {
  id?: string;
  name: string;
  start_date: string | null;
  end_date: string | null;
  is_active: boolean;
  pledge_goal?: number;
  pledge_thresholds?: PledgeThreshold[];
  reward_tiers?: RewardTier[];
  redemption_rules?: string | null;
  show_rules_publicly?: boolean;
  ward_pledge_targets?: WardPledgeTarget[];
}

export function useUpdateCampaignSettings() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (values: CampaignSettingsInput) => {
      const { id, ...rest } = values;
      const payload = rest as Record<string, unknown>;

      if (id) {
        const { error } = await supabase
          .from("campaign_settings")
          .update(payload)
          .eq("id", id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("campaign_settings")
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          .insert(payload as any);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["campaign-settings"] });
      toast({ title: "Campaign settings saved" });
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
