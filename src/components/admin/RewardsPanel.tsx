import { useState } from "react";
import { Gift, Plus, Trash2, Pencil } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  useAdminRedemptions, useAdminRewards, useDeleteReward, useSaveReward,
  useUpdateRedemptionStatus, type AdminReward,
} from "@/hooks/useAdminMutations";

const emptyReward = {
  id: undefined as string | undefined,
  name: "",
  description: "",
  token_cost: 100,
  stock: "" as string,
  is_active: true,
};

const RewardsPanel = () => {
  const { data: rewards, isLoading } = useAdminRewards();
  const { data: redemptions, isLoading: redemptionsLoading } = useAdminRedemptions();
  const save = useSaveReward();
  const remove = useDeleteReward();
  const updateRedemption = useUpdateRedemptionStatus();

  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(emptyReward);

  const startEdit = (r: AdminReward) => {
    setForm({
      id: r.id,
      name: r.name,
      description: r.description ?? "",
      token_cost: r.token_cost,
      stock: r.stock === null ? "" : String(r.stock),
      is_active: r.is_active,
    });
    setOpen(true);
  };

  const submit = () => {
    if (!form.name.trim()) return;
    save.mutate(
      {
        id: form.id,
        name: form.name.trim(),
        description: form.description.trim() || null,
        token_cost: Number(form.token_cost) || 0,
        stock: form.stock.trim() === "" ? null : Number(form.stock),
        is_active: form.is_active,
      },
      { onSuccess: () => setOpen(false) },
    );
  };

  return (
    <div className="space-y-6">
      <Card className="shadow-card">
        <CardHeader>
          <div className="flex items-center justify-between gap-3">
            <div>
              <CardTitle className="text-lg flex items-center gap-2">
                <Gift size={18} /> Rewards Catalogue
              </CardTitle>
              <CardDescription>Add rewards, set point costs and stock, or hide them from members.</CardDescription>
            </div>
            <Button
              size="sm"
              className="font-heading font-semibold shrink-0"
              onClick={() => { setForm(emptyReward); setOpen(true); }}
            >
              <Plus size={15} className="mr-1" /> Add
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-14 w-full" />)}
            </div>
          ) : (rewards ?? []).length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">No rewards yet</p>
          ) : (
            <div className="space-y-3">
              {(rewards ?? []).map((r) => (
                <div key={r.id} className="flex items-center justify-between gap-3 p-3 rounded-lg border border-border">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{r.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {r.token_cost} points · {r.stock === null ? "Unlimited stock" : `${r.stock} left`}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Badge className={r.is_active
                      ? "bg-primary/10 text-primary border-primary/20"
                      : "bg-muted text-muted-foreground border-border"}>
                      {r.is_active ? "Visible" : "Hidden"}
                    </Badge>
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => startEdit(r)}>
                      <Pencil size={14} />
                    </Button>
                    <Button
                      variant="ghost" size="icon" className="h-8 w-8 text-destructive"
                      onClick={() => remove.mutate(r.id)}
                    >
                      <Trash2 size={14} />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="text-lg">Redemption Requests</CardTitle>
          <CardDescription>Approve or decline what members have claimed with their points.</CardDescription>
        </CardHeader>
        <CardContent>
          {redemptionsLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}
            </div>
          ) : (redemptions ?? []).length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">No redemptions yet</p>
          ) : (
            <div className="space-y-3">
              {(redemptions ?? []).map((r) => (
                <div key={r.id} className="flex items-center justify-between gap-3 p-3 rounded-lg bg-muted/50">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{r.reward_name}</p>
                    <p className="text-xs text-muted-foreground">
                      {r.tokens_spent} points · {new Date(r.created_at).toLocaleDateString("en-NG", {
                        day: "numeric", month: "short", year: "numeric",
                      })}
                    </p>
                  </div>
                  <Select value={r.status} onValueChange={(status) => updateRedemption.mutate({ id: r.id, status })}>
                    <SelectTrigger className="w-32 h-9 shrink-0"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="approved">Approved</SelectItem>
                      <SelectItem value="fulfilled">Fulfilled</SelectItem>
                      <SelectItem value="declined">Declined</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-heading">{form.id ? "Edit reward" : "New reward"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="reward-name">Name</Label>
              <Input id="reward-name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="reward-desc">Description</Label>
              <Textarea
                id="reward-desc" rows={3} value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="reward-cost">Point cost</Label>
                <Input
                  id="reward-cost" type="number" min={0} value={form.token_cost}
                  onChange={(e) => setForm({ ...form, token_cost: Number(e.target.value) })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="reward-stock">Stock (blank = unlimited)</Label>
                <Input
                  id="reward-stock" type="number" min={0} value={form.stock}
                  onChange={(e) => setForm({ ...form, stock: e.target.value })}
                />
              </div>
            </div>
            <div className="flex items-center justify-between rounded-lg border border-border p-3">
              <div>
                <p className="text-sm font-medium text-foreground">Visible to members</p>
                <p className="text-xs text-muted-foreground">Turn off to hide it from the rewards list.</p>
              </div>
              <Switch checked={form.is_active} onCheckedChange={(v) => setForm({ ...form, is_active: v })} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button className="font-heading font-semibold" onClick={submit} disabled={save.isPending}>
              {save.isPending ? "Saving..." : "Save reward"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RewardsPanel;
