import { useEffect, useState } from "react";
import { Target, Plus, Trash2, Gift } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useCampaignSettings,
  useUpdateCampaignSettings,
  type PledgeThreshold,
  type RewardTier,
} from "@/hooks/useCampaignSettings";

const CampaignRulesCard = () => {
  const { data, isLoading } = useCampaignSettings();
  const update = useUpdateCampaignSettings();

  const [goal, setGoal] = useState("1000000");
  const [thresholds, setThresholds] = useState<PledgeThreshold[]>([]);
  const [tiers, setTiers] = useState<RewardTier[]>([]);
  const [rules, setRules] = useState("");
  const [showPublicly, setShowPublicly] = useState(true);

  useEffect(() => {
    if (data) {
      setGoal(String(data.pledge_goal ?? 1000000));
      setThresholds(data.pledge_thresholds ?? []);
      setTiers(data.reward_tiers ?? []);
      setRules(data.redemption_rules ?? "");
      setShowPublicly(data.show_rules_publicly);
    }
  }, [data]);

  const handleSave = () => {
    update.mutate({
      id: data?.id,
      name: data?.name ?? "1 Million Pledge Campaign",
      start_date: data?.start_date ?? null,
      end_date: data?.end_date ?? null,
      is_active: data?.is_active ?? true,
      pledge_goal: Math.max(0, Number(goal) || 0),
      pledge_thresholds: thresholds
        .filter((t) => t.label.trim())
        .map((t) => ({ label: t.label.trim(), target: Math.max(0, Number(t.target) || 0) })),
      reward_tiers: tiers
        .filter((t) => t.name.trim())
        .map((t) => ({
          name: t.name.trim(),
          min_pledges: Math.max(0, Number(t.min_pledges) || 0),
          tokens: Math.max(0, Number(t.tokens) || 0),
        })),
      redemption_rules: rules.trim() || null,
      show_rules_publicly: showPublicly,
    });
  };

  return (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Target size={18} /> Pledge Targets & Reward Rules
        </CardTitle>
        <CardDescription>
          Set the overall pledge goal, milestone targets, reward tiers and redemption rules. These can be
          shown to visitors next to the LGAs leaderboard.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </div>
        ) : (
          <>
            <div className="space-y-2">
              <Label htmlFor="pledge-goal">Overall pledge goal</Label>
              <Input
                id="pledge-goal"
                type="number"
                min={0}
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
              />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>Pledge milestones</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setThresholds([...thresholds, { label: "", target: 0 }])}
                >
                  <Plus size={14} className="mr-1" /> Add
                </Button>
              </div>
              {thresholds.length === 0 && (
                <p className="text-xs text-muted-foreground">No milestones yet.</p>
              )}
              {thresholds.map((t, i) => (
                <div key={i} className="flex gap-2">
                  <Input
                    placeholder="Milestone name"
                    value={t.label}
                    onChange={(e) => {
                      const next = [...thresholds];
                      next[i] = { ...next[i], label: e.target.value };
                      setThresholds(next);
                    }}
                  />
                  <Input
                    className="w-32"
                    type="number"
                    min={0}
                    placeholder="Pledges"
                    value={t.target}
                    onChange={(e) => {
                      const next = [...thresholds];
                      next[i] = { ...next[i], target: Number(e.target.value) };
                      setThresholds(next);
                    }}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    aria-label="Remove milestone"
                    onClick={() => setThresholds(thresholds.filter((_, idx) => idx !== i))}
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              ))}
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="flex items-center gap-1.5">
                  <Gift size={14} /> Reward tiers
                </Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setTiers([...tiers, { name: "", min_pledges: 0, tokens: 0 }])}
                >
                  <Plus size={14} className="mr-1" /> Add
                </Button>
              </div>
              {tiers.length === 0 && <p className="text-xs text-muted-foreground">No reward tiers yet.</p>}
              {tiers.map((t, i) => (
                <div key={i} className="grid grid-cols-[1fr_6rem_6rem_2.5rem] gap-2">
                  <Input
                    placeholder="Tier name"
                    value={t.name}
                    onChange={(e) => {
                      const next = [...tiers];
                      next[i] = { ...next[i], name: e.target.value };
                      setTiers(next);
                    }}
                  />
                  <Input
                    type="number"
                    min={0}
                    placeholder="Pledges"
                    value={t.min_pledges}
                    onChange={(e) => {
                      const next = [...tiers];
                      next[i] = { ...next[i], min_pledges: Number(e.target.value) };
                      setTiers(next);
                    }}
                  />
                  <Input
                    type="number"
                    min={0}
                    placeholder="Tokens"
                    value={t.tokens}
                    onChange={(e) => {
                      const next = [...tiers];
                      next[i] = { ...next[i], tokens: Number(e.target.value) };
                      setTiers(next);
                    }}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    aria-label="Remove tier"
                    onClick={() => setTiers(tiers.filter((_, idx) => idx !== i))}
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              ))}
              <p className="text-xs text-muted-foreground">
                Columns: tier name, pledges needed, tokens earned.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="redemption-rules">Redemption rules</Label>
              <Textarea
                id="redemption-rules"
                rows={4}
                placeholder="Explain how tokens can be redeemed, expiry, limits per person..."
                value={rules}
                onChange={(e) => setRules(e.target.value)}
              />
            </div>

            <div className="flex items-center justify-between rounded-lg border border-border p-3">
              <div>
                <p className="text-sm font-medium text-foreground">Show rules publicly</p>
                <p className="text-xs text-muted-foreground">
                  Display targets, tiers and rules beside the LGAs leaderboard.
                </p>
              </div>
              <Switch checked={showPublicly} onCheckedChange={setShowPublicly} />
            </div>

            <Button
              className="font-heading font-semibold"
              onClick={handleSave}
              disabled={update.isPending}
            >
              {update.isPending ? "Saving..." : "Save Rules"}
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default CampaignRulesCard;
