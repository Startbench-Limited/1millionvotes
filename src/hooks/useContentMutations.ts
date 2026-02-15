import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface ContentInput {
  title: string;
  type: string;
  content?: string;
  image_url?: string;
  status?: string;
}

export function useCreateContent() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: ContentInput) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { error } = await supabase.from("campaign_content").insert({
        title: input.title,
        type: input.type,
        content: input.content ?? null,
        image_url: input.image_url ?? null,
        status: input.status ?? "draft",
        created_by: user.id,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-content"] });
      toast.success("Content created successfully");
    },
    onError: (e) => toast.error(e.message),
  });
}

export function useUpdateContent() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...input }: ContentInput & { id: string }) => {
      const { error } = await supabase
        .from("campaign_content")
        .update({
          title: input.title,
          type: input.type,
          content: input.content ?? null,
          image_url: input.image_url ?? null,
          status: input.status,
        })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-content"] });
      toast.success("Content updated");
    },
    onError: (e) => toast.error(e.message),
  });
}

export function useDeleteContent() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("campaign_content").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-content"] });
      toast.success("Content deleted");
    },
    onError: (e) => toast.error(e.message),
  });
}

export function useToggleContentStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, currentStatus }: { id: string; currentStatus: string }) => {
      const newStatus = currentStatus === "published" ? "draft" : "published";
      const { error } = await supabase
        .from("campaign_content")
        .update({ status: newStatus })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-content"] });
      toast.success("Status updated");
    },
    onError: (e) => toast.error(e.message),
  });
}
