import { useState } from "react";
import { ChevronDown, ChevronRight, Coins, ClipboardList, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { useVolunteerOverview } from "@/hooks/useAdminData";

const dateLabel = (value: string | null) =>
  value
    ? new Date(value).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" })
    : "No deadline";

const VolunteerProgressPanel = () => {
  const { data, isLoading } = useVolunteerOverview();
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <ClipboardList size={18} /> Volunteer Progress
        </CardTitle>
        <CardDescription>
          {isLoading ? "Loading volunteers..." : `${(data ?? []).length} volunteers — tasks, points and pledge history`}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        ) : (data ?? []).length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">No volunteers yet</p>
        ) : (
          <div className="space-y-3">
            {(data ?? []).map((v) => {
              const open = openId === v.userId;
              const completion = v.tasksTotal > 0 ? (v.tasksCompleted / v.tasksTotal) * 100 : 0;
              return (
                <div key={v.userId} className="rounded-lg border border-border">
                  <button
                    type="button"
                    className="w-full text-left p-4 flex items-start justify-between gap-3"
                    onClick={() => setOpenId(open ? null : v.userId)}
                    aria-expanded={open}
                  >
                    <div className="min-w-0">
                      <p className="font-medium text-sm text-foreground truncate">{v.name}</p>
                      <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
                        <MapPin size={11} /> {v.lga ?? "LGA not set"} · {v.state ?? "Kano"}
                      </p>
                      <div className="mt-2 max-w-xs">
                        <div className="flex justify-between text-xs text-muted-foreground mb-1">
                          <span>
                            {v.tasksCompleted}/{v.tasksTotal} tasks done
                          </span>
                          <span>{v.pledges.length} pledges</span>
                        </div>
                        <Progress value={completion} className="h-2" />
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <Badge className="bg-primary/10 text-primary border-primary/20">
                        <Coins size={11} className="mr-1" /> {v.tokens} pts
                      </Badge>
                      {open ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                    </div>
                  </button>

                  {open && (
                    <div className="border-t border-border p-4 grid gap-4 sm:grid-cols-2">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-primary mb-2">Tasks</p>
                        {v.tasks.length === 0 ? (
                          <p className="text-xs text-muted-foreground">No tasks assigned</p>
                        ) : (
                          <ul className="space-y-2">
                            {v.tasks.map((t) => (
                              <li key={t.id} className="text-sm">
                                <span className="text-foreground">{t.task}</span>
                                <span className="block text-xs text-muted-foreground">
                                  {t.status} · {t.tokens_reward} pts · {dateLabel(t.deadline)}
                                </span>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-primary mb-2">
                          Pledge history
                        </p>
                        {v.pledges.length === 0 ? (
                          <p className="text-xs text-muted-foreground">No pledges yet</p>
                        ) : (
                          <ul className="space-y-2">
                            {v.pledges.map((p) => (
                              <li key={p.id} className="text-sm">
                                <span className="text-foreground">
                                  {p.ward}, {p.lga}
                                </span>
                                <span className="block text-xs text-muted-foreground">
                                  {p.status} · {dateLabel(p.created_at)}
                                </span>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default VolunteerProgressPanel;
