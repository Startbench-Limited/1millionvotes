import { useMemo, useState } from "react";
import { Search, Shield, Coins } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { useAdminUsers } from "@/hooks/useAdminData";
import { useAdjustTokens, useSetUserRole, useUserRoles } from "@/hooks/useAdminMutations";

const statusColor = (s: string) =>
  s === "verified"
    ? "bg-primary/10 text-primary border-primary/20"
    : s === "pending"
      ? "bg-alert/10 text-alert-foreground border-alert/20"
      : "bg-muted text-muted-foreground border-border";

const MembersPanel = () => {
  const { data: users, isLoading } = useAdminUsers();
  const { data: roles } = useUserRoles();
  const setRole = useSetUserRole();
  const adjustTokens = useAdjustTokens();

  const [query, setQuery] = useState("");
  const [editing, setEditing] = useState<string | null>(null);
  const [tokenValue, setTokenValue] = useState("");

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return users ?? [];
    return (users ?? []).filter((u) =>
      [u.name, u.state ?? ""].some((v) => v.toLowerCase().includes(q)),
    );
  }, [users, query]);

  const saveTokens = (userId: string) => {
    adjustTokens.mutate(
      { userId, tokens: Number(tokenValue) || 0 },
      { onSuccess: () => setEditing(null) },
    );
  };

  return (
    <Card className="shadow-card">
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <CardTitle className="text-lg flex items-center gap-2">
              <Shield size={18} /> Member Management
            </CardTitle>
            <CardDescription>
              Set access levels and correct reward points for any member.
            </CardDescription>
          </div>
          <div className="relative w-full sm:w-64">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by name or state..."
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
            {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead className="hidden sm:table-cell">State</TableHead>
                  <TableHead>Pledge</TableHead>
                  <TableHead className="hidden md:table-cell">Referrals</TableHead>
                  <TableHead>Points</TableHead>
                  <TableHead>Access</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((u) => (
                  <TableRow key={u.id}>
                    <TableCell>
                      <p className="font-medium text-sm text-foreground">{u.name}</p>
                      <p className="text-xs text-muted-foreground hidden sm:block">
                        Joined {new Date(u.pledgeDate).toLocaleDateString("en-NG", { day: "numeric", month: "short" })}
                      </p>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell text-sm">{u.state ?? "—"}</TableCell>
                    <TableCell><Badge className={statusColor(u.status)}>{u.status}</Badge></TableCell>
                    <TableCell className="hidden md:table-cell text-sm">{u.referrals}</TableCell>
                    <TableCell>
                      {editing === u.id ? (
                        <div className="flex items-center gap-1">
                          <Input
                            type="number" min={0} value={tokenValue}
                            onChange={(e) => setTokenValue(e.target.value)}
                            className="h-8 w-20"
                          />
                          <Button size="sm" className="h-8" onClick={() => saveTokens(u.id)} disabled={adjustTokens.isPending}>
                            Save
                          </Button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          className="flex items-center gap-1 text-sm font-heading font-semibold text-primary"
                          onClick={() => { setEditing(u.id); setTokenValue(String(u.tokens)); }}
                        >
                          <Coins size={13} /> {u.tokens}
                        </button>
                      )}
                    </TableCell>
                    <TableCell>
                      <Select
                        value={roles?.get(u.id) ?? "user"}
                        onValueChange={(role) => setRole.mutate({ userId: u.id, role: role as "admin" | "moderator" | "user" })}
                      >
                        <SelectTrigger className="h-8 w-28"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="user">Member</SelectItem>
                          <SelectItem value="moderator">Moderator</SelectItem>
                          <SelectItem value="admin">Admin</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                  </TableRow>
                ))}
                {rows.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                      No members found
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

export default MembersPanel;
