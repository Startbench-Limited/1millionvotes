import { useMemo, useState } from "react";
import { Search, ListChecks } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useAdminPledges } from "@/hooks/useAdminData";

const statusColor = (s: string) =>
  s === "verified"
    ? "bg-primary/10 text-primary border-primary/20"
    : s === "pending"
      ? "bg-alert/10 text-alert-foreground border-alert/20"
      : "bg-destructive/10 text-destructive border-destructive/20";

const PledgeListPanel = () => {
  const { data, isLoading } = useAdminPledges();
  const [query, setQuery] = useState("");

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return data ?? [];
    return (data ?? []).filter((p) =>
      [p.full_name, p.lga, p.ward, p.polling_unit, p.phone].some((v) => (v ?? "").toLowerCase().includes(q)),
    );
  }, [data, query]);

  return (
    <Card className="shadow-card">
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <CardTitle className="text-lg flex items-center gap-2">
              <ListChecks size={18} /> Pledge List
            </CardTitle>
            <CardDescription>
              {isLoading ? "Loading pledges..." : `${rows.length} pledges — each pledge counts as 1 vote`}
            </CardDescription>
          </div>
          <div className="relative w-full sm:w-72">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search name, ward, LGA or phone..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Pledge</TableHead>
                  <TableHead>Ward</TableHead>
                  <TableHead className="hidden sm:table-cell">LGA</TableHead>
                  <TableHead className="hidden lg:table-cell">Polling unit</TableHead>
                  <TableHead className="hidden md:table-cell">Submitted</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell>
                      <p className="font-medium text-sm text-foreground">{p.full_name}</p>
                      <p className="text-xs text-muted-foreground">{p.phone}</p>
                    </TableCell>
                    <TableCell className="text-sm font-heading font-semibold text-primary">1 vote</TableCell>
                    <TableCell className="text-sm">{p.ward}</TableCell>
                    <TableCell className="hidden sm:table-cell text-sm">{p.lga}</TableCell>
                    <TableCell className="hidden lg:table-cell text-sm text-muted-foreground">
                      {p.polling_unit}
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-sm text-muted-foreground">
                      {new Date(p.created_at).toLocaleString("en-NG", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </TableCell>
                    <TableCell>
                      <Badge className={statusColor(p.status)}>{p.status}</Badge>
                    </TableCell>
                  </TableRow>
                ))}
                {rows.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                      No pledges found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PledgeListPanel;
