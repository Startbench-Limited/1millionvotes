import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

type AppRole = "admin" | "moderator" | "user";

function useInvalidator(keys: string[]) {
  const qc = useQueryClient();
  return () => keys.forEach((k) => qc.invalidateQueries({ queryKey: [k] }));
}

/* ---------------- Pledges ---------------- */

export function useUpdatePledgeStatus() {
  const invalidate = useInvalidator(["admin-pledges", "admin-stats", "admin-users", "admin-volunteer-overview"]);
  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase.from("pledges").update({ status }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      invalidate();
      toast.success("Pledge updated");
    },
    onError: (e: Error) => toast.error(e.message),
  });
}

export function useDeletePledge() {
  const invalidate = useInvalidator(["admin-pledges", "admin-stats"]);
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("pledges").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      invalidate();
      toast.success("Pledge removed");
    },
    onError: (e: Error) => toast.error(e.message),
  });
}

/* ---------------- Members: roles & points ---------------- */

export function useUserRoles() {
  return useQuery({
    queryKey: ["admin-user-roles"],
    queryFn: async () => {
      const { data, error } = await supabase.from("user_roles").select("user_id, role");
      if (error) throw error;
      const map = new Map<string, AppRole>();
      (data ?? []).forEach((r) => {
        const role = r.role as AppRole;
        const current = map.get(r.user_id);
        // admin outranks moderator outranks user
        const rank = { admin: 3, moderator: 2, user: 1 } as const;
        if (!current || rank[role] > rank[current]) map.set(r.user_id, role);
      });
      return map;
    },
  });
}

export function useSetUserRole() {
  const invalidate = useInvalidator(["admin-user-roles", "is-admin"]);
  return useMutation({
    mutationFn: async ({ userId, role }: { userId: string; role: AppRole }) => {
      const { error: delError } = await supabase.from("user_roles").delete().eq("user_id", userId);
      if (delError) throw delError;
      const { error } = await supabase.from("user_roles").insert({ user_id: userId, role });
      if (error) throw error;
    },
    onSuccess: () => {
      invalidate();
      toast.success("Access level updated");
    },
    onError: (e: Error) => toast.error(e.message),
  });
}

export function useAdjustTokens() {
  const invalidate = useInvalidator(["admin-users", "admin-volunteer-overview"]);
  return useMutation({
    mutationFn: async ({ userId, tokens }: { userId: string; tokens: number }) => {
      const { error } = await supabase
        .from("profiles")
        .update({ reward_tokens: Math.max(0, Math.round(tokens)) })
        .eq("user_id", userId);
      if (error) throw error;
    },
    onSuccess: () => {
      invalidate();
      toast.success("Points updated");
    },
    onError: (e: Error) => toast.error(e.message),
  });
}

/* ---------------- Volunteer tasks ---------------- */

export interface VolunteerTaskInput {
  user_id: string;
  task: string;
  description?: string | null;
  state?: string | null;
  tokens_reward?: number;
  deadline?: string | null;
}

export function useCreateVolunteerTask() {
  const invalidate = useInvalidator(["admin-volunteers", "admin-volunteer-overview", "admin-stats"]);
  return useMutation({
    mutationFn: async (input: VolunteerTaskInput) => {
      const { error } = await supabase.from("volunteers").insert({
        user_id: input.user_id,
        task: input.task,
        description: input.description ?? null,
        state: input.state ?? "Kano",
        tokens_reward: input.tokens_reward ?? 0,
        deadline: input.deadline ?? null,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      invalidate();
      toast.success("Task assigned");
    },
    onError: (e: Error) => toast.error(e.message),
  });
}

export function useUpdateVolunteerTask() {
  const invalidate = useInvalidator(["admin-volunteers", "admin-volunteer-overview"]);
  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase.from("volunteers").update({ status }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      invalidate();
      toast.success("Task updated");
    },
    onError: (e: Error) => toast.error(e.message),
  });
}

export function useDeleteVolunteerTask() {
  const invalidate = useInvalidator(["admin-volunteers", "admin-volunteer-overview"]);
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("volunteers").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      invalidate();
      toast.success("Task removed");
    },
    onError: (e: Error) => toast.error(e.message),
  });
}

/* ---------------- Rewards & redemptions ---------------- */

export interface AdminReward {
  id: string;
  name: string;
  description: string | null;
  token_cost: number;
  stock: number | null;
  is_active: boolean;
}

export function useAdminRewards() {
  return useQuery({
    queryKey: ["admin-rewards"],
    queryFn: async (): Promise<AdminReward[]> => {
      const { data, error } = await supabase
        .from("rewards")
        .select("id, name, description, token_cost, stock, is_active")
        .order("token_cost", { ascending: true });
      if (error) throw error;
      return data ?? [];
    },
  });
}

export interface RewardInput {
  id?: string;
  name: string;
  description?: string | null;
  token_cost: number;
  stock: number | null;
  is_active: boolean;
}

export function useSaveReward() {
  const invalidate = useInvalidator(["admin-rewards", "rewards"]);
  return useMutation({
    mutationFn: async (input: RewardInput) => {
      const payload = {
        name: input.name,
        description: input.description ?? null,
        token_cost: Math.max(0, Math.round(input.token_cost)),
        stock: input.stock === null ? null : Math.max(0, Math.round(input.stock)),
        is_active: input.is_active,
      };
      if (input.id) {
        const { error } = await supabase.from("rewards").update(payload).eq("id", input.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("rewards").insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      invalidate();
      toast.success("Reward saved");
    },
    onError: (e: Error) => toast.error(e.message),
  });
}

export function useDeleteReward() {
  const invalidate = useInvalidator(["admin-rewards", "rewards"]);
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("rewards").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      invalidate();
      toast.success("Reward removed");
    },
    onError: (e: Error) => toast.error(e.message),
  });
}

export interface AdminRedemption {
  id: string;
  user_id: string;
  reward_name: string;
  tokens_spent: number;
  status: string;
  created_at: string;
}

export function useAdminRedemptions() {
  return useQuery({
    queryKey: ["admin-redemptions"],
    queryFn: async (): Promise<AdminRedemption[]> => {
      const { data, error } = await supabase
        .from("redemptions")
        .select("id, user_id, reward_name, tokens_spent, status, created_at")
        .order("created_at", { ascending: false })
        .limit(100);
      if (error) throw error;
      return data ?? [];
    },
  });
}

export function useUpdateRedemptionStatus() {
  const invalidate = useInvalidator(["admin-redemptions", "redemptions"]);
  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase.from("redemptions").update({ status }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      invalidate();
      toast.success("Redemption updated");
    },
    onError: (e: Error) => toast.error(e.message),
  });
}
