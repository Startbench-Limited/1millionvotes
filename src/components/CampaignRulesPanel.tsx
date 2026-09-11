import { Gift, Flag, ScrollText } from "lucide-react";
import { useCampaignSettings } from "@/hooks/useCampaignSettings";

const formatNumber = (n: number) => n.toLocaleString("en-NG");

const CampaignRulesPanel = ({ className = "" }: { className?: string }) => {
  const { data } = useCampaignSettings();

  if (!data || !data.show_rules_publicly) return null;

  const hasThresholds = data.pledge_thresholds.length > 0;
  const hasTiers = data.reward_tiers.length > 0;
  const hasRules = !!data.redemption_rules;

  if (!hasThresholds && !hasTiers && !hasRules) return null;

  return (
    <div className={`rounded-xl border border-border bg-card p-4 sm:p-5 ${className}`}>
      <h3 className="font-heading font-bold text-base sm:text-lg text-foreground mb-1">
        Campaign Targets & Rewards
      </h3>
      <p className="text-xs text-muted-foreground mb-4">
        Goal: {formatNumber(data.pledge_goal)} pledges
      </p>

      {hasThresholds && (
        <div className="mb-4">
          <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-primary mb-2">
            <Flag size={13} /> Milestones
          </p>
          <ul className="space-y-1.5">
            {data.pledge_thresholds.map((t, i) => (
              <li key={i} className="flex justify-between text-sm">
                <span className="text-foreground">{t.label}</span>
                <span className="font-semibold text-primary">{formatNumber(t.target)}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {hasTiers && (
        <div className="mb-4">
          <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-primary mb-2">
            <Gift size={13} /> Reward tiers
          </p>
          <ul className="space-y-1.5">
            {data.reward_tiers.map((t, i) => (
              <li key={i} className="flex items-center justify-between gap-3 text-sm">
                <span className="text-foreground">{t.name}</span>
                <span className="text-xs text-muted-foreground whitespace-nowrap">
                  {formatNumber(t.min_pledges)} pledges ·{" "}
                  <span className="font-semibold text-primary">{formatNumber(t.tokens)} tokens</span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {hasRules && (
        <div>
          <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-primary mb-2">
            <ScrollText size={13} /> Redemption rules
          </p>
          <p className="text-sm text-muted-foreground whitespace-pre-line">{data.redemption_rules}</p>
        </div>
      )}
    </div>
  );
};

export default CampaignRulesPanel;
