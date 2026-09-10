import { useEffect, useState } from "react";
import { CalendarDays } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useCampaignSettings,
  useUpdateCampaignSettings,
  campaignDaysLeft,
  formatCampaignDate,
} from "@/hooks/useCampaignSettings";

const CampaignSettingsCard = () => {
  const { data, isLoading } = useCampaignSettings();
  const update = useUpdateCampaignSettings();

  const [name, setName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    if (data) {
      setName(data.name ?? "");
      setStartDate(data.start_date ?? "");
      setEndDate(data.end_date ?? "");
      setIsActive(data.is_active);
    }
  }, [data]);

  const invalidRange = !!startDate && !!endDate && endDate < startDate;
  const daysLeft = campaignDaysLeft(endDate || null);

  const handleSave = () => {
    if (invalidRange) return;
    update.mutate({
      id: data?.id,
      name: name.trim() || "1 Million Pledge Campaign",
      start_date: startDate || null,
      end_date: endDate || null,
      is_active: isActive,
    });
  };

  return (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <CalendarDays size={18} /> Campaign Period
        </CardTitle>
        <CardDescription>
          These dates appear publicly on the Kano map and the LGAs leaderboard.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-10 w-full" />)}
          </div>
        ) : (
          <>
            <div className="space-y-2">
              <Label htmlFor="campaign-name">Campaign name</Label>
              <Input id="campaign-name" value={name} onChange={e => setName(e.target.value)} />
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="campaign-start">Start date</Label>
                <Input id="campaign-start" type="date" value={startDate} onChange={e => setStartDate(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="campaign-end">End date</Label>
                <Input id="campaign-end" type="date" value={endDate} onChange={e => setEndDate(e.target.value)} />
              </div>
            </div>

            {invalidRange && (
              <p className="text-sm text-destructive">The end date must be after the start date.</p>
            )}

            <div className="flex items-center justify-between rounded-lg border border-border p-3">
              <div>
                <p className="text-sm font-medium text-foreground">Show dates publicly</p>
                <p className="text-xs text-muted-foreground">Turn off to hide the campaign period from visitors.</p>
              </div>
              <Switch checked={isActive} onCheckedChange={setIsActive} />
            </div>

            <div className="rounded-lg bg-muted/50 p-3 text-sm">
              <p className="text-foreground font-medium">
                {formatCampaignDate(startDate || null)} – {formatCampaignDate(endDate || null)}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {daysLeft === null
                  ? "No end date set"
                  : daysLeft === 0
                    ? "Campaign closed"
                    : `${daysLeft} days left`}
              </p>
            </div>

            <Button
              className="font-heading font-semibold"
              onClick={handleSave}
              disabled={update.isPending || invalidRange}
            >
              {update.isPending ? "Saving..." : "Save Campaign Dates"}
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default CampaignSettingsCard;
