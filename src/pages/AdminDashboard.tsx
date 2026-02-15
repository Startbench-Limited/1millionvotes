import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft, BarChart3, CheckCircle, Clock, Edit, Eye, FileText,
  Image, MoreHorizontal, Search, Settings, Shield, TrendingUp,
  Users, UserCheck, Zap, Trash2, Globe
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table";
import {
  ChartContainer, ChartTooltip, ChartTooltipContent
} from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";
import { Skeleton } from "@/components/ui/skeleton";
import campaignLogo from "@/assets/campaign-logo.png";
import {
  useAdminStats, useTopStates, useAdminUsers,
  useVolunteerTasks, useCampaignContent
} from "@/hooks/useAdminData";
import {
  useCreateContent, useUpdateContent, useDeleteContent, useToggleContentStatus
} from "@/hooks/useContentMutations";
import { ContentFormDialog, type ContentFormData } from "@/components/admin/ContentFormDialog";

const chartConfig = {
  pledges: { label: "Pledges", color: "hsl(120, 100%, 25%)" },
};

const AdminDashboard = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [contentDialogOpen, setContentDialogOpen] = useState(false);
  const [editingContent, setEditingContent] = useState<ContentFormData | null>(null);

  const { data: stats, isLoading: statsLoading } = useAdminStats();
  const { data: topStates, isLoading: statesLoading } = useTopStates();
  const { data: users, isLoading: usersLoading } = useAdminUsers();
  const { data: volunteers, isLoading: volunteersLoading } = useVolunteerTasks();
  const { data: content, isLoading: contentLoading } = useCampaignContent();

  const createContent = useCreateContent();
  const updateContent = useUpdateContent();
  const deleteContent = useDeleteContent();
  const toggleStatus = useToggleContentStatus();

  const filteredUsers = (users ?? []).filter(u =>
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (u.state ?? "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  const statusColor = (s: string) => {
    if (s === "verified" || s === "published") return "bg-primary/10 text-primary border-primary/20";
    if (s === "pending" || s === "draft") return "bg-alert/10 text-alert-foreground border-alert/20";
    return "bg-destructive/10 text-destructive border-destructive/20";
  };

  const handleContentSubmit = (data: ContentFormData) => {
    if (data.id) {
      updateContent.mutate({ id: data.id, ...data }, { onSuccess: () => setContentDialogOpen(false) });
    } else {
      createContent.mutate(data, { onSuccess: () => setContentDialogOpen(false) });
    }
  };

  const s = stats ?? { totalPledges: 0, verifiedPledges: 0, todayPledges: 0, weekGrowth: 0, activeVolunteers: 0, totalVolunteers: 0 };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/">
              <Button variant="ghost" size="sm"><ArrowLeft size={18} className="mr-1" /> Home</Button>
            </Link>
            <img src={campaignLogo} alt="Campaign" className="h-10 w-auto hidden sm:block" />
          </div>
          <div className="flex items-center gap-2">
            <Badge className="bg-destructive/10 text-destructive border-destructive/20 font-heading">
              <Shield size={12} className="mr-1" /> Admin
            </Badge>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Title */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="font-heading font-bold text-2xl sm:text-3xl text-foreground">Admin Dashboard</h1>
          <p className="text-muted-foreground mt-1">Campaign overview and management tools</p>
        </motion.div>

        {/* Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {statsLoading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <Card key={i} className="shadow-card"><CardContent className="p-4"><Skeleton className="h-20 w-full" /></CardContent></Card>
            ))
          ) : (
            [
              { label: "Total Pledges", value: s.totalPledges.toLocaleString(), icon: Users, sub: `+${s.todayPledges.toLocaleString()} today` },
              { label: "Verified", value: s.verifiedPledges.toLocaleString(), icon: UserCheck, sub: s.totalPledges > 0 ? `${((s.verifiedPledges / s.totalPledges) * 100).toFixed(1)}% rate` : "0% rate" },
              { label: "Active Volunteers", value: s.activeVolunteers.toLocaleString(), icon: CheckCircle, sub: `of ${s.totalVolunteers.toLocaleString()} total` },
              { label: "Weekly Growth", value: `+${s.weekGrowth}%`, icon: TrendingUp, sub: "vs last week" },
            ].map((stat, i) => (
              <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                <Card className="shadow-card">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <stat.icon size={20} className="text-primary" />
                    </div>
                    <p className="font-heading font-bold text-xl sm:text-2xl text-foreground">{stat.value}</p>
                    <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
                    <p className="text-xs text-primary font-medium mt-0.5">{stat.sub}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))
          )}
        </div>

        {/* Tabs */}
        <Tabs defaultValue="analytics" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 h-auto">
            <TabsTrigger value="analytics" className="text-xs sm:text-sm py-2">Analytics</TabsTrigger>
            <TabsTrigger value="users" className="text-xs sm:text-sm py-2">Users</TabsTrigger>
            <TabsTrigger value="volunteers" className="text-xs sm:text-sm py-2">Volunteers</TabsTrigger>
            <TabsTrigger value="content" className="text-xs sm:text-sm py-2">Content</TabsTrigger>
          </TabsList>

          {/* Analytics */}
          <TabsContent value="analytics">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2"><BarChart3 size={18} /> Top States by Pledges</CardTitle>
                </CardHeader>
                <CardContent>
                  {statesLoading ? (
                    <Skeleton className="h-[280px] w-full" />
                  ) : (topStates ?? []).length > 0 ? (
                    <ChartContainer config={chartConfig} className="h-[280px]">
                      <BarChart data={topStates}>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                        <XAxis dataKey="state" className="text-xs" />
                        <YAxis className="text-xs" />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Bar dataKey="pledges" fill="hsl(120, 100%, 25%)" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ChartContainer>
                  ) : (
                    <p className="text-sm text-muted-foreground text-center py-12">No pledge data yet</p>
                  )}
                </CardContent>
              </Card>

              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="text-lg">State Breakdown</CardTitle>
                </CardHeader>
                <CardContent>
                  {statesLoading ? (
                    <div className="space-y-3">{Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-8 w-full" />)}</div>
                  ) : (topStates ?? []).length > 0 ? (
                    <div className="space-y-3">
                      {(topStates ?? []).map((st, i) => (
                        <div key={st.state} className="flex items-center gap-3">
                          <span className="w-5 text-xs text-muted-foreground font-mono">{i + 1}</span>
                          <div className="flex-1">
                            <div className="flex justify-between mb-1">
                              <span className="text-sm font-medium text-foreground">{st.state}</span>
                              <span className="text-xs text-muted-foreground">{st.pledges.toLocaleString()} ({st.percentage}%)</span>
                            </div>
                            <Progress value={topStates![0].pledges > 0 ? (st.pledges / topStates![0].pledges) * 100 : 0} className="h-2" />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground text-center py-12">No pledge data yet</p>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Users */}
          <TabsContent value="users">
            <Card className="shadow-card">
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <CardTitle className="text-lg">User Management</CardTitle>
                    <CardDescription>{(users ?? []).length} registered users</CardDescription>
                  </div>
                  <div className="relative w-full sm:w-64">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      placeholder="Search by name or state..."
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {usersLoading ? (
                  <div className="space-y-3">{Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}</div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead className="hidden sm:table-cell">State</TableHead>
                        <TableHead className="hidden md:table-cell">Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="hidden sm:table-cell">Referrals</TableHead>
                        <TableHead className="hidden md:table-cell">Tokens</TableHead>
                        <TableHead className="w-10"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredUsers.map(user => (
                        <TableRow key={user.id}>
                          <TableCell>
                            <p className="font-medium text-sm text-foreground">{user.name}</p>
                          </TableCell>
                          <TableCell className="hidden sm:table-cell text-sm">{user.state ?? "—"}</TableCell>
                          <TableCell className="hidden md:table-cell text-sm text-muted-foreground">
                            {new Date(user.pledgeDate).toLocaleDateString("en-NG", { day: "numeric", month: "short" })}
                          </TableCell>
                          <TableCell>
                            <Badge className={statusColor(user.status)}>{user.status}</Badge>
                          </TableCell>
                          <TableCell className="hidden sm:table-cell text-sm">{user.referrals}</TableCell>
                          <TableCell className="hidden md:table-cell text-sm font-heading font-semibold text-primary">{user.tokens}</TableCell>
                          <TableCell>
                            <Button variant="ghost" size="icon" className="h-8 w-8"><Eye size={14} /></Button>
                          </TableCell>
                        </TableRow>
                      ))}
                      {filteredUsers.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center text-muted-foreground py-8">No users found</TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Volunteers */}
          <TabsContent value="volunteers">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="text-lg">Volunteer Task Coordination</CardTitle>
                <CardDescription>Track and manage volunteer assignments</CardDescription>
              </CardHeader>
              <CardContent>
                {volunteersLoading ? (
                  <div className="space-y-4">{Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-20 w-full" />)}</div>
                ) : (volunteers ?? []).length > 0 ? (
                  <div className="space-y-4">
                    {(volunteers ?? []).map(task => (
                      <div key={task.id} className="p-4 rounded-lg border border-border hover:border-primary/30 transition-colors">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                          <div>
                            <p className="font-medium text-sm text-foreground">{task.task}</p>
                            <p className="text-xs text-muted-foreground mt-0.5">
                              {task.state ?? "All"} • {task.deadline ? `Due ${new Date(task.deadline).toLocaleDateString("en-NG", { day: "numeric", month: "short" })}` : "No deadline"}
                            </p>
                          </div>
                          <Badge variant={task.status === "completed" ? "default" : "secondary"}>
                            {task.status} • {task.tokens_reward} tokens
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-8">No volunteer tasks yet</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Content */}
          <TabsContent value="content">
            <Card className="shadow-card">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">Campaign Content</CardTitle>
                    <CardDescription>Manage news updates and gallery</CardDescription>
                  </div>
                  <Button size="sm" className="font-heading font-semibold" onClick={() => { setEditingContent(null); setContentDialogOpen(true); }}>+ Add Content</Button>
                </div>
              </CardHeader>
              <CardContent>
                {contentLoading ? (
                  <div className="space-y-3">{Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-14 w-full" />)}</div>
                ) : (content ?? []).length > 0 ? (
                  <div className="space-y-3">
                    {(content ?? []).map(item => (
                      <div key={item.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center">
                            {item.type === "news" ? <FileText size={14} className="text-primary" /> : <Image size={14} className="text-primary" />}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-foreground">{item.title}</p>
                            <p className="text-xs text-muted-foreground">
                              {item.type} • {new Date(item.created_at).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" })}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge
                            className={`${statusColor(item.status)} cursor-pointer`}
                            onClick={() => toggleStatus.mutate({ id: item.id, currentStatus: item.status })}
                          >
                            {item.status === "published" ? <Globe size={10} className="mr-1" /> : <Clock size={10} className="mr-1" />}
                            {item.status}
                          </Badge>
                          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => {
                            setEditingContent({ id: item.id, title: item.title, type: item.type, content: "", image_url: "", status: item.status });
                            setContentDialogOpen(true);
                          }}><Edit size={14} /></Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => deleteContent.mutate(item.id)}><Trash2 size={14} /></Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-8">No content yet</p>
                )}
              </CardContent>
            </Card>

            <ContentFormDialog
              open={contentDialogOpen}
              onOpenChange={setContentDialogOpen}
              onSubmit={handleContentSubmit}
              initialData={editingContent}
              isPending={createContent.isPending || updateContent.isPending}
            />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default AdminDashboard;
