import { CalendarDays, Clock } from "lucide-react";
import { useCampaignSettings, formatCampaignDate, campaignDaysLeft } from "@/hooks/useCampaignSettings";

const CampaignPeriodBadge = ({ className = "" }: { className?: string }) => {
  const { data } = useCampaignSettings();

  if (!data || !data.is_active || (!data.start_date && !data.end_date)) return null;

  const daysLeft = campaignDaysLeft(data.end_date);

  return (
    <div
      className={`inline-flex flex-wrap items-center gap-x-3 gap-y-1 rounded-full border border-primary/20 bg-primary/5 px-3 py-1.5 ${className}`}
    >
      <span className="flex items-center gap-1.5 text-[11px] sm:text-xs font-medium text-foreground">
        <CalendarDays size={13} className="text-primary" />
        {formatCampaignDate(data.start_date)} – {formatCampaignDate(data.end_date)}
      </span>
      {daysLeft !== null && (
        <span className="flex items-center gap-1 text-[11px] sm:text-xs font-semibold text-primary">
          <Clock size={12} />
          {daysLeft === 0 ? "Campaign closed" : `${daysLeft} days left`}
        </span>
      )}
    </div>
  );
};

export default CampaignPeriodBadge;
