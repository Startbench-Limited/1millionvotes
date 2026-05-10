import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export interface UserProfile {
  id: string;
  user_id: string;
  full_name: string;
  email: string;
  phone: string | null;
  state: string | null;
  lga: string | null;
  ward: string | null;
  polling_unit: string | null;
  referral_code: string | null;
  reward_tokens: number;
  avatar_initials: string;
  pledge_status: "verified" | "pending" | "rejected";
}

export interface PledgeHistoryItem {
  id: string;
  action: string;
  date: string;
  tokens: number;
}

export interface ReferralItem {
  id: string;
  name: string;
  state: string;
  date: string;
  status: "verified" | "pending" | "rejected";
}

export interface VolunteerTaskItem {
  id: string;
  title: string;
  dueDate: string;
  status: "completed" | "in_progress" | "upcoming";
  tokens: number;
}

export interface PledgeRecord {
  id: string;
  full_name: string;
  phone: string;
  state: string;
  lga: string;
  ward: string;
  polling_unit: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface RewardItem {
  id: string;
  name: string;
  description: string | null;
  token_cost: number;
  stock: number | null;
  image_url: string | null;
}

export interface RedemptionItem {
  id: string;
  reward_name: string;
  tokens_spent: number;
  status: string;
  created_at: string;
}

export interface NotificationPrefs {
  campaign_updates: boolean;
  pledge_progress: boolean;
}

const initials = (name: string) =>
  name.split(" ").filter(Boolean).map((n) => n[0]?.toUpperCase()).slice(0, 2).join("") || "U";

const mapTaskStatus = (s: string): VolunteerTaskItem["status"] =>
  s === "completed" ? "completed" : s === "in_progress" || s === "active" ? "in_progress" : "upcoming";

const mapPledgeStatus = (s: string): UserProfile["pledge_status"] =>
  s === "verified" ? "verified" : s === "rejected" ? "rejected" : "pending";

export const useUserDashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [pledgeHistory, setPledgeHistory] = useState<PledgeHistoryItem[]>([]);
  const [pledges, setPledges] = useState<PledgeRecord[]>([]);
  const [referrals, setReferrals] = useState<ReferralItem[]>([]);
  const [tasks, setTasks] = useState<VolunteerTaskItem[]>([]);
  const [rewards, setRewards] = useState<RewardItem[]>([]);
  const [redemptions, setRedemptions] = useState<RedemptionItem[]>([]);
  const [notifPrefs, setNotifPrefs] = useState<NotificationPrefs>({
    campaign_updates: true,
    pledge_progress: true,
  });

  const fetchAll = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }
    setLoading(true);

    const [
      { data: profileRow },
      { data: pledgesRows },
      { data: refRows },
      { data: taskRows },
      { data: rewardsRows },
      { data: redemptionRows },
      { data: prefsRow },
    ] = await Promise.all([
      supabase.from("profiles").select("*").eq("user_id", user.id).maybeSingle(),
      supabase.from("pledges").select("*").eq("user_id", user.id).order("created_at", { ascending: false }),
      supabase.from("referrals").select("*").eq("referrer_id", user.id).order("created_at", { ascending: false }),
      supabase.from("volunteers").select("*").eq("user_id", user.id).order("deadline", { ascending: true }),
      supabase.from("rewards").select("*").eq("is_active", true).order("token_cost", { ascending: true }),
      supabase.from("redemptions").select("*").eq("user_id", user.id).order("created_at", { ascending: false }),
      supabase.from("notification_preferences").select("*").eq("user_id", user.id).maybeSingle(),
    ]);

    let referralItems: ReferralItem[] = [];
    if (refRows && refRows.length > 0) {
      const ids = refRows.map((r) => r.referred_id);
      const { data: refProfiles } = await supabase
        .from("profiles").select("user_id, full_name, state").in("user_id", ids);
      const map = new Map((refProfiles ?? []).map((p) => [p.user_id, p]));
      referralItems = refRows.map((r) => {
        const p = map.get(r.referred_id);
        return {
          id: r.id,
          name: p?.full_name ?? "Pending member",
          state: p?.state ?? "—",
          date: r.created_at,
          status: (r.status as ReferralItem["status"]) ?? "pending",
        };
      });
    }

    const history: PledgeHistoryItem[] = [];
    for (const p of pledgesRows ?? []) {
      history.push({
        id: `pledge-${p.id}`,
        action: p.status === "verified" ? "Pledge verified" : "Pledge registered",
        date: p.created_at,
        tokens: p.status === "verified" ? 70 : 50,
      });
    }
    for (const r of referralItems) {
      history.push({
        id: `ref-${r.id}`,
        action: `Referred ${r.name}`,
        date: r.date,
        tokens: r.status === "verified" ? 50 : 30,
      });
    }
    for (const t of taskRows ?? []) {
      if (t.status === "completed") {
        history.push({
          id: `task-${t.id}`,
          action: `Completed task: ${t.task}`,
          date: t.updated_at,
          tokens: t.tokens_reward ?? 0,
        });
      }
    }
    for (const r of redemptionRows ?? []) {
      history.push({
        id: `redeem-${r.id}`,
        action: `Redeemed ${r.reward_name}`,
        date: r.created_at,
        tokens: -(r.tokens_spent ?? 0),
      });
    }
    history.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    const latestPledge = pledgesRows?.[0];
    const fullName = profileRow?.full_name ?? user.user_metadata?.full_name ?? "Supporter";

    setProfile(
      profileRow
        ? {
            id: profileRow.id,
            user_id: profileRow.user_id,
            full_name: fullName,
            email: user.email ?? "",
            phone: profileRow.phone,
            state: profileRow.state,
            lga: profileRow.lga,
            ward: profileRow.ward,
            polling_unit: profileRow.polling_unit,
            referral_code: profileRow.referral_code,
            reward_tokens: profileRow.reward_tokens ?? 0,
            avatar_initials: initials(fullName),
            pledge_status: latestPledge ? mapPledgeStatus(latestPledge.status) : "pending",
          }
        : null
    );
    setPledgeHistory(history);
    setPledges((pledgesRows ?? []) as PledgeRecord[]);
    setReferrals(referralItems);
    setTasks(
      (taskRows ?? []).map((t) => ({
        id: t.id,
        title: t.task,
        dueDate: t.deadline ?? t.created_at,
        status: mapTaskStatus(t.status),
        tokens: t.tokens_reward ?? 0,
      }))
    );
    setRewards((rewardsRows ?? []) as RewardItem[]);
    setRedemptions((redemptionRows ?? []) as RedemptionItem[]);
    if (prefsRow) {
      setNotifPrefs({
        campaign_updates: prefsRow.campaign_updates,
        pledge_progress: prefsRow.pledge_progress,
      });
    }
    setLoading(false);
  }, [user]);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user || !profile) return { error: new Error("Not authenticated") };
    const { error } = await supabase
      .from("profiles")
      .update({
        full_name: updates.full_name ?? profile.full_name,
        phone: updates.phone ?? profile.phone,
        state: updates.state ?? profile.state,
        lga: updates.lga ?? profile.lga,
        ward: updates.ward ?? profile.ward,
        polling_unit: updates.polling_unit ?? profile.polling_unit,
      })
      .eq("user_id", user.id);
    if (!error) await fetchAll();
    return { error };
  };

  const redeemReward = async (rewardId: string) => {
    const { error } = await supabase.rpc("redeem_reward", { _reward_id: rewardId });
    if (!error) await fetchAll();
    return { error };
  };

  const updateNotifPrefs = async (next: NotificationPrefs) => {
    if (!user) return { error: new Error("Not authenticated") };
    const { error } = await supabase
      .from("notification_preferences")
      .upsert({ user_id: user.id, ...next }, { onConflict: "user_id" });
    if (!error) setNotifPrefs(next);
    return { error };
  };

  return {
    loading, profile, pledgeHistory, pledges, referrals, tasks,
    rewards, redemptions, notifPrefs,
    refresh: fetchAll, updateProfile, redeemReward, updateNotifPrefs,
  };
};
