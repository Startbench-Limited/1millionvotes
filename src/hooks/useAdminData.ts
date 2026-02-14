import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface AdminStats {
  totalPledges: number;
  verifiedPledges: number;
  todayPledges: number;
  weekGrowth: number;
  totalVolunteers: number;
  activeVolunteers: number;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  state: string | null;
  pledgeDate: string;
  status: string;
  referrals: number;
  tokens: number;
}

export interface VolunteerTask {
  id: string;
  task: string;
  state: string | null;
  deadline: string | null;
  status: string;
  user_id: string;
  tokens_reward: number;
}

export interface ContentItem {
  id: string;
  type: string;
  title: string;
  status: string;
  created_at: string;
}

export function useAdminStats() {
  return useQuery({
    queryKey: ["admin-stats"],
    queryFn: async (): Promise<AdminStats> => {
      const [pledgesRes, verifiedRes, todayRes, volunteersRes] = await Promise.all([
        supabase.from("pledges").select("id", { count: "exact", head: true }),
        supabase.from("pledges").select("id", { count: "exact", head: true }).eq("status", "verified"),
        supabase.from("pledges").select("id", { count: "exact", head: true })
          .gte("created_at", new Date(new Date().setHours(0, 0, 0, 0)).toISOString()),
        supabase.from("volunteers").select("id", { count: "exact", head: true }),
      ]);

      const totalPledges = pledgesRes.count ?? 0;
      const verifiedPledges = verifiedRes.count ?? 0;
      const todayPledges = todayRes.count ?? 0;
      const totalVolunteers = volunteersRes.count ?? 0;

      return {
        totalPledges,
        verifiedPledges,
        todayPledges,
        weekGrowth: 0,
        totalVolunteers,
        activeVolunteers: totalVolunteers,
      };
    },
  });
}

export function useTopStates() {
  return useQuery({
    queryKey: ["admin-top-states"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("state_pledge_counts")
        .select("state, pledge_count")
        .order("pledge_count", { ascending: false })
        .limit(8);

      if (error) throw error;

      const total = (data ?? []).reduce((sum, s) => sum + (s.pledge_count ?? 0), 0);

      return (data ?? []).map(s => ({
        state: s.state ?? "Unknown",
        pledges: s.pledge_count ?? 0,
        percentage: total > 0 ? Math.round(((s.pledge_count ?? 0) / total) * 1000) / 10 : 0,
      }));
    },
  });
}

export function useAdminUsers() {
  return useQuery({
    queryKey: ["admin-users"],
    queryFn: async (): Promise<AdminUser[]> => {
      const { data: profiles, error } = await supabase
        .from("profiles")
        .select("user_id, full_name, state, reward_tokens, created_at")
        .order("created_at", { ascending: false })
        .limit(50);

      if (error) throw error;

      // Get pledge statuses for these users
      const userIds = (profiles ?? []).map(p => p.user_id);
      const { data: pledges } = await supabase
        .from("pledges")
        .select("user_id, status")
        .in("user_id", userIds.length > 0 ? userIds : ["none"]);

      const { data: referrals } = await supabase
        .from("referrals")
        .select("referrer_id")
        .in("referrer_id", userIds.length > 0 ? userIds : ["none"]);

      const pledgeMap = new Map<string, string>();
      (pledges ?? []).forEach(p => pledgeMap.set(p.user_id, p.status));

      const refCountMap = new Map<string, number>();
      (referrals ?? []).forEach(r => {
        refCountMap.set(r.referrer_id, (refCountMap.get(r.referrer_id) ?? 0) + 1);
      });

      return (profiles ?? []).map(p => ({
        id: p.user_id,
        name: p.full_name,
        email: "",
        state: p.state,
        pledgeDate: p.created_at,
        status: pledgeMap.get(p.user_id) ?? "no pledge",
        referrals: refCountMap.get(p.user_id) ?? 0,
        tokens: p.reward_tokens,
      }));
    },
  });
}

export function useVolunteerTasks() {
  return useQuery({
    queryKey: ["admin-volunteers"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("volunteers")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(50);

      if (error) throw error;
      return data ?? [];
    },
  });
}

export function useCampaignContent() {
  return useQuery({
    queryKey: ["admin-content"],
    queryFn: async (): Promise<ContentItem[]> => {
      const { data, error } = await supabase
        .from("campaign_content")
        .select("id, type, title, status, created_at")
        .order("created_at", { ascending: false })
        .limit(50);

      if (error) throw error;
      return data ?? [];
    },
  });
}
