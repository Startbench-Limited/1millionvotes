import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft, BarChart3, CheckCircle, Clock, Edit, Eye, FileText,
  Image, MoreHorizontal, Search, Settings, Shield, TrendingUp,
  Users, UserCheck, Zap, Trash2
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
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, LineChart, Line, ResponsiveContainer } from "recharts";
import campaignLogo from "@/assets/campaign-logo.png";
import {
  mockAdminStats, mockPledgeTrend, mockTopStates,
  mockAdminUsers, mockVolunteerCoordination, mockCampaignContent
} from "@/data/mockDashboardData";

const chartConfig = {
  pledges: { label: "Pledges", color: "hsl(120, 100%, 25%)" },
};

const AdminDashboard = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const filteredUsers = mockAdminUsers.filter(u =>
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.state.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const statusColor = (s: string) => {
    if (s === "verified" || s === "published") return "bg-primary/10 text-primary border-primary/20";
    if (s === "pending" || s === "draft") return "bg-alert/10 text-alert-foreground border-alert/20";
    return "bg-destructive/10 text-destructive border-destructive/20";
  };

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
          {[
            { label: "Total Pledges", value: mockAdminStats.totalPledges.toLocaleString(), icon: Users, sub: `+${mockAdminStats.todayPledges.toLocaleString()} today` },
            { label: "Verified", value: mockAdminStats.verifiedPledges.toLocaleString(), icon: UserCheck, sub: `${((mockAdminStats.verifiedPledges / mockAdminStats.totalPledges) * 100).toFixed(1)}% rate` },
            { label: "Active Volunteers", value: mockAdminStats.activeVolunteers.toLocaleString(), icon: CheckCircle, sub: `of ${mockAdminStats.totalVolunteers.toLocaleString()} total` },
            { label: "Weekly Growth", value: `+${mockAdminStats.weekGrowth}%`, icon: TrendingUp, sub: "vs last week" },
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
          ))}
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
                  <CardTitle className="text-lg flex items-center gap-2"><BarChart3 size={18} /> Pledge Growth Trend</CardTitle>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={chartConfig} className="h-[280px]">
                    <BarChart data={mockPledgeTrend}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                      <XAxis dataKey="month" className="text-xs" />
                      <YAxis className="text-xs" />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="pledges" fill="hsl(120, 100%, 25%)" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ChartContainer>
                </CardContent>
              </Card>

              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="text-lg">Top States by Pledges</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {mockTopStates.map((s, i) => (
                      <div key={s.state} className="flex items-center gap-3">
                        <span className="w-5 text-xs text-muted-foreground font-mono">{i + 1}</span>
                        <div className="flex-1">
                          <div className="flex justify-between mb-1">
                            <span className="text-sm font-medium text-foreground">{s.state}</span>
                            <span className="text-xs text-muted-foreground">{s.pledges.toLocaleString()} ({s.percentage}%)</span>
                          </div>
                          <Progress value={s.percentage * (100 / mockTopStates[0].percentage)} className="h-2" />
                        </div>
                      </div>
                    ))}
                  </div>
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
                    <CardDescription>{mockAdminUsers.length} registered users</CardDescription>
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
                          <div>
                            <p className="font-medium text-sm text-foreground">{user.name}</p>
                            <p className="text-xs text-muted-foreground">{user.email}</p>
                          </div>
                        </TableCell>
                        <TableCell className="hidden sm:table-cell text-sm">{user.state}</TableCell>
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
                  </TableBody>
                </Table>
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
                <div className="space-y-4">
                  {mockVolunteerCoordination.map(task => {
                    const completion = (task.completed / task.assignedTo) * 100;
                    return (
                      <div key={task.id} className="p-4 rounded-lg border border-border hover:border-primary/30 transition-colors">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                          <div>
                            <p className="font-medium text-sm text-foreground">{task.task}</p>
                            <p className="text-xs text-muted-foreground mt-0.5">
                              {task.state} • Due {new Date(task.deadline).toLocaleDateString("en-NG", { day: "numeric", month: "short" })}
                            </p>
                          </div>
                          <Badge variant={completion === 100 ? "default" : "secondary"}>
                            {task.completed}/{task.assignedTo} completed
                          </Badge>
                        </div>
                        <Progress value={completion} className="h-2" />
                      </div>
                    );
                  })}
                </div>
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
                  <Button size="sm" className="font-heading font-semibold">+ Add Content</Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {mockCampaignContent.map(item => (
                    <div key={item.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center">
                          {item.type === "news" ? <FileText size={14} className="text-primary" /> : <Image size={14} className="text-primary" />}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground">{item.title}</p>
                          <p className="text-xs text-muted-foreground">
                            {item.type} • {new Date(item.date).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" })}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={statusColor(item.status)}>{item.status}</Badge>
                        <Button variant="ghost" size="icon" className="h-8 w-8"><Edit size={14} /></Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive"><Trash2 size={14} /></Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default AdminDashboard;
