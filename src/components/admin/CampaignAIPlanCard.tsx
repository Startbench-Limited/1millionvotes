import { useState } from "react";
import { Sparkles, Loader2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { lgaWardNames } from "@/data/kanoPledgeData";
import {
  useCampaignSettings,
  useUpdateCampaignSettings,
  type PledgeThreshold,
  type RewardTier,
  type WardPledgeTarget,
} from "@/hooks/useCampaignSettings";

interface GeneratedPlan {
  lga_targets: { lga: string; target: number }[];
  milestones: PledgeThreshold[];
  reward_tiers: RewardTier[];
  redemption_rules: string;
}

const formatNumber = (n: number) => n.toLocaleString("en-NG");

// Deterministic weight so the same ward always gets the same share of its LGA target.
const wardWeight = (name: string) => {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = (hash * 31 + name.charCodeAt(i)) % 100000;
  return 0.7 + (hash % 61) / 100; // 0.70 – 1.30
};

const spreadAcrossWards = (lga: string, target: number): WardPledgeTarget[] => {
  const wards = lgaWardNames[lga] ?? [];
  if (wards.length === 0) return [];
  const weights = wards.map(wardWeight);
  const totalWeight = weights.reduce((a, b) => a + b, 0);
  let assigned = 0;
  return wards.map((ward, i) => {
    const isLast = i === wards.length - 1;
    const value = isLast
      ? Math.max(0, target - assigned)
      : Math.max(1, Math.round((target * weights[i]) / totalWeight));
    assigned += value;
    return { lga, ward, target: value };
  });
};

const CampaignAIPlanCard = () => {
  const { data } = useCampaignSettings();
  const update = useUpdateCampaignSettings();
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState<GeneratedPlan | null>(null);

  const generate = async () => {
    setLoading(true);
    setPlan(null);
    try {
      const { data: result, error } = await supabase.functions.invoke("generate-campaign-plan", {
        body: {
          lgas: Object.keys(lgaWardNames),
          goal: data?.pledge_goal ?? 1000000,
        },
      });
      if (error) throw error;
      const generated = result as GeneratedPlan;
      if (!generated?.lga_targets?.length) throw new Error("The plan came back empty. Please try again.");
      setPlan(generated);
    } catch (e) {
      const message = e instanceof Error ? e.message : "Could not generate the plan";
      toast({ title: "Generation failed", description: message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const apply = () => {
    if (!plan || !data) return;
    const wardTargets = plan.lga_targets.flatMap((t) =>
      spreadAcrossWards(t.lga, Math.max(0, Math.round(t.target))),
    );

    update.mutate(
      {
        id: data.id,
        name: data.name,
        start_date: data.start_date,
        end_date: data.end_date,
        is_active: data.is_active,
        pledge_goal: data.pledge_goal,
        pledge_thresholds: plan.milestones.map((m) => ({
          label: m.label,
          target: Math.max(0, Math.round(m.target)),
        })),
        reward_tiers: plan.reward_tiers.map((t) => ({
          name: t.name,
          min_pledges: Math.max(0, Math.round(t.min_pledges)),
          tokens: Math.max(0, Math.round(t.tokens)),
        })),
        redemption_rules: plan.redemption_rules,
        show_rules_publicly: data.show_rules_publicly,
        ward_pledge_targets: wardTargets,
      },
      { onSuccess: () => setPlan(null) },
    );
  };

  const topWards = plan
    ? plan.lga_targets
        .flatMap((t) => spreadAcrossWards(t.lga, Math.max(0, Math.round(t.target))))
        .sort((a, b) => b.target - a.target)
        .slice(0, 8)
    : [];

  return (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Sparkles size={18} /> AI Campaign Planner
        </CardTitle>
        <CardDescription>
          Generate realistic pledge targets for every Kano ward, plus reward tiers and redemption rules. Review
          the suggestion before saving it — saved figures appear on the public leaderboard.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        <Button onClick={generate} disabled={loading} className="font-heading font-semibold">
          {loading ? (
            <>
              <Loader2 size={15} className="mr-2 animate-spin" /> Generating...
            </>
          ) : (
            <>
              <Sparkles size={15} className="mr-2" /> Generate suggestion
            </>
          )}
        </Button>

        {data?.ward_pledge_targets?.length ? (
          <p className="text-xs text-muted-foreground">
            Currently saved: targets for {formatNumber(data.ward_pledge_targets.length)} wards.
          </p>
        ) : null}

        {plan && (
          <div className="space-y-4 rounded-lg border border-border p-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-primary mb-2">Milestones</p>
              <ul className="space-y-1">
                {plan.milestones.map((m, i) => (
                  <li key={i} className="flex justify-between text-sm">
                    <span>{m.label}</span>
                    <span className="font-semibold text-primary">{formatNumber(m.target)}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-primary mb-2">Reward tiers</p>
              <ul className="space-y-1">
                {plan.reward_tiers.map((t, i) => (
                  <li key={i} className="flex justify-between gap-3 text-sm">
                    <span>{t.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {formatNumber(t.min_pledges)} pledges ·{" "}
                      <span className="font-semibold text-primary">{formatNumber(t.tokens)} tokens</span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-primary mb-2">Top ward targets</p>
              <ul className="space-y-1">
                {topWards.map((w, i) => (
                  <li key={i} className="flex justify-between gap-3 text-sm">
                    <span>
                      {w.ward} <span className="text-xs text-muted-foreground">({w.lga})</span>
                    </span>
                    <span className="font-semibold text-primary">{formatNumber(w.target)}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-primary mb-2">Redemption rules</p>
              <p className="text-sm text-muted-foreground whitespace-pre-line">{plan.redemption_rules}</p>
            </div>

            <div className="flex gap-2">
              <Button onClick={apply} disabled={update.isPending} className="font-heading font-semibold">
                <Check size={15} className="mr-2" />
                {update.isPending ? "Saving..." : "Save to campaign"}
              </Button>
              <Button variant="outline" onClick={() => setPlan(null)}>
                Discard
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CampaignAIPlanCard;
