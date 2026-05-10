import { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft, Award, Bell, Calendar, CheckCircle, Copy, Gift, LogOut, MapPin,
  Share2, ShoppingBag, Star, User, Users, Zap, Loader2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import campaignLogo from "@/assets/campaign-logo.png";
import { mockRewardTiers } from "@/data/mockDashboardData";
import { useAuth } from "@/contexts/AuthContext";
import { useUserDashboard, type PledgeRecord } from "@/hooks/useUserDashboard";

const UserDashboard = () => {
  const { toast } = useToast();
  const { user, loading: authLoading } = useAuth();
  const {
    loading, profile, pledgeHistory, pledges, referrals, tasks,
    rewards, redemptions, notifPrefs,
    updateProfile, redeemReward, updateNotifPrefs,
  } = useUserDashboard();

  const [form, setForm] = useState({
    full_name: "", phone: "", state: "", lga: "", ward: "", polling_unit: "",
  });
  const [selectedPledge, setSelectedPledge] = useState<PledgeRecord | null>(null);
  const [redeemingId, setRedeemingId] = useState<string | null>(null);

  useEffect(() => {
    if (profile) {
      setForm({
        full_name: profile.full_name ?? "",
        phone: profile.phone ?? "",
        state: profile.state ?? "",
        lga: profile.lga ?? "",
        ward: profile.ward ?? "",
        polling_unit: profile.polling_unit ?? "",
      });
    }
  }, [profile]);

  if (!authLoading && !user) return <Navigate to="/auth" replace />;

  if (authLoading || loading || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const tokens = profile.reward_tokens;
  const currentTier = mockRewardTiers.find(t => tokens >= t.minTokens && tokens <= t.maxTokens) || mockRewardTiers[0];
  const nextTier = mockRewardTiers.find(t => t.minTokens > tokens);
  const progressToNext = nextTier
    ? ((tokens - currentTier.minTokens) / (nextTier.minTokens - currentTier.minTokens)) * 100
    : 100;

  const copyReferralLink = () => {
    navigator.clipboard.writeText(`${window.location.origin}/auth?ref=${profile.referral_code}`);
    toast({ title: "Referral link copied!", description: "Share it with friends to earn tokens." });
  };

  const statusColor = (s: string) => {
    if (s === "verified" || s === "fulfilled") return "bg-primary/10 text-primary border-primary/20";
    if (s === "pending") return "bg-alert/10 text-alert-foreground border-alert/20";
    return "bg-destructive/10 text-destructive border-destructive/20";
  };

  const taskStatusBadge = (s: string) => {
    if (s === "completed") return <Badge className="bg-primary/10 text-primary border-primary/20">Completed</Badge>;
    if (s === "in_progress") return <Badge className="bg-alert/10 text-alert-foreground border-alert/20">In Progress</Badge>;
    return <Badge variant="secondary">Upcoming</Badge>;
  };

  const handleSave = async () => {
    const { error } = await updateProfile(form);
    if (error) toast({ title: "Could not save", description: error.message, variant: "destructive" });
    else toast({ title: "Profile updated" });
  };

  const handleRedeem = async (rewardId: string, cost: number, name: string) => {
    if (tokens < cost) {
      toast({ title: "Not enough tokens", description: `You need ${cost - tokens} more tokens.`, variant: "destructive" });
      return;
    }
    setRedeemingId(rewardId);
    const { error } = await redeemReward(rewardId);
    setRedeemingId(null);
    if (error) toast({ title: "Redemption failed", description: error.message, variant: "destructive" });
    else toast({ title: "Reward redeemed!", description: `${name} is on its way.` });
  };

  const handleNotifToggle = async (key: "campaign_updates" | "pledge_progress", val: boolean) => {
    const next = { ...notifPrefs, [key]: val };
    const { error } = await updateNotifPrefs(next);
    if (error) toast({ title: "Could not save preference", description: error.message, variant: "destructive" });
  };

  const fmtDate = (d: string) =>
    new Date(d).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" });
  const fmtDateTime = (d: string) =>
    new Date(d).toLocaleString("en-NG", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/"><Button variant="ghost" size="sm"><ArrowLeft size={18} className="mr-1" /> Home</Button></Link>
            <img src={campaignLogo} alt="Campaign" className="h-10 w-auto hidden sm:block" />
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20">
              <Zap size={14} className="text-primary" />
              <span className="text-sm font-heading font-bold text-primary">{tokens} tokens</span>
            </div>
            <div className="w-9 h-9 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-heading font-bold text-sm">
              {profile.avatar_initials}
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-6xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="font-heading font-bold text-2xl sm:text-3xl text-foreground">
            Welcome back, {profile.full_name.split(" ")[0]}!
          </h1>
          <p className="text-muted-foreground mt-1">Here's your pledge dashboard overview.</p>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Pledge Status", value: profile.pledge_status, icon: CheckCircle, highlight: true },
            { label: "Reward Tokens", value: tokens.toLocaleString(), icon: Zap },
            { label: "Referrals", value: referrals.length, icon: Users },
            { label: "Tasks Done", value: tasks.filter(t => t.status === "completed").length, icon: Star },
          ].map((stat, i) => (
            <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
              <Card className="shadow-card">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <stat.icon size={20} className="text-primary" />
                    {stat.highlight && (<Badge className={statusColor(profile.pledge_status)}>{profile.pledge_status}</Badge>)}
                  </div>
                  <p className="font-heading font-bold text-2xl text-foreground">{stat.value}</p>
                  <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <Card className="mb-8 shadow-card overflow-hidden">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: currentTier.color + "22", border: `2px solid ${currentTier.color}` }}>
                  <Award size={24} style={{ color: currentTier.color }} />
                </div>
                <div>
                  <h3 className="font-heading font-bold text-lg text-foreground">{currentTier.name} Tier</h3>
                  <p className="text-sm text-muted-foreground">{tokens} tokens earned</p>
                </div>
              </div>
              {nextTier && (
                <p className="text-sm text-muted-foreground">
                  {nextTier.minTokens - tokens} tokens to <span className="font-semibold text-foreground">{nextTier.name}</span>
                </p>
              )}
            </div>
            <Progress value={progressToNext} className="h-3" />
            <div className="flex justify-between mt-3">
              {mockRewardTiers.map(tier => (
                <span key={tier.name} className="text-xs font-medium" style={{ color: tier.color }}>{tier.name}</span>
              ))}
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="history" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 sm:grid-cols-6 h-auto">
            <TabsTrigger value="history" className="text-xs sm:text-sm py-2">History</TabsTrigger>
            <TabsTrigger value="pledges" className="text-xs sm:text-sm py-2">Pledges</TabsTrigger>
            <TabsTrigger value="rewards" className="text-xs sm:text-sm py-2">Rewards</TabsTrigger>
            <TabsTrigger value="referrals" className="text-xs sm:text-sm py-2">Referrals</TabsTrigger>
            <TabsTrigger value="notifications" className="text-xs sm:text-sm py-2">Alerts</TabsTrigger>
            <TabsTrigger value="profile" className="text-xs sm:text-sm py-2">Profile</TabsTrigger>
          </TabsList>

          <TabsContent value="history">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="text-lg">Activity & Token History</CardTitle>
                <CardDescription>Your pledge journey, redemptions, and earned rewards</CardDescription>
              </CardHeader>
              <CardContent>
                {pledgeHistory.length === 0 ? (
                  <p className="text-sm text-muted-foreground py-6 text-center">No activity yet. Register a pledge to get started.</p>
                ) : (
                  <div className="space-y-4">
                    {pledgeHistory.map((item, i) => {
                      const negative = item.tokens < 0;
                      return (
                        <motion.div key={item.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                          className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                              <Gift size={14} className="text-primary" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-foreground">{item.action}</p>
                              <p className="text-xs text-muted-foreground">{fmtDate(item.date)}</p>
                            </div>
                          </div>
                          <span className={`text-sm font-heading font-bold ${negative ? "text-destructive" : "text-primary"}`}>
                            {negative ? "" : "+"}{item.tokens}
                          </span>
                        </motion.div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="pledges">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="text-lg">Your Pledges ({pledges.length})</CardTitle>
                <CardDescription>Tap any pledge to view full details</CardDescription>
              </CardHeader>
              <CardContent>
                {pledges.length === 0 ? (
                  <p className="text-sm text-muted-foreground py-6 text-center">No pledges yet.</p>
                ) : (
                  <div className="space-y-3">
                    {pledges.map(p => (
                      <button
                        key={p.id}
                        onClick={() => setSelectedPledge(p)}
                        className="w-full text-left flex items-center justify-between p-4 rounded-lg border border-border hover:border-primary/40 hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center">
                            <MapPin size={16} className="text-primary" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-foreground">{p.lga}, {p.state}</p>
                            <p className="text-xs text-muted-foreground">{fmtDate(p.created_at)} • Ward {p.ward}</p>
                          </div>
                        </div>
                        <Badge className={statusColor(p.status)}>{p.status}</Badge>
                      </button>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="rewards">
            <Card className="shadow-card mb-6">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <ShoppingBag size={18} className="text-primary" /> Available Rewards
                </CardTitle>
                <CardDescription>Spend your tokens on campaign rewards</CardDescription>
              </CardHeader>
              <CardContent>
                {rewards.length === 0 ? (
                  <p className="text-sm text-muted-foreground py-6 text-center">No rewards available right now.</p>
                ) : (
                  <div className="grid sm:grid-cols-2 gap-4">
                    {rewards.map(r => {
                      const canAfford = tokens >= r.token_cost;
                      const outOfStock = r.stock !== null && r.stock <= 0;
                      return (
                        <div key={r.id} className="flex flex-col p-4 rounded-lg border border-border">
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <div>
                              <p className="font-heading font-semibold text-foreground">{r.name}</p>
                              {r.description && <p className="text-xs text-muted-foreground mt-0.5">{r.description}</p>}
                            </div>
                            <Badge variant="secondary" className="shrink-0">
                              <Zap size={10} className="mr-1" />{r.token_cost}
                            </Badge>
                          </div>
                          <div className="flex items-center justify-between mt-auto pt-3">
                            <span className="text-xs text-muted-foreground">
                              {r.stock !== null ? `${r.stock} left` : "Unlimited"}
                            </span>
                            <Button
                              size="sm"
                              disabled={!canAfford || outOfStock || redeemingId === r.id}
                              onClick={() => handleRedeem(r.id, r.token_cost, r.name)}
                            >
                              {redeemingId === r.id ? <Loader2 size={14} className="animate-spin" /> :
                                outOfStock ? "Sold out" : canAfford ? "Redeem" : "Not enough"}
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="text-lg">Redemption History ({redemptions.length})</CardTitle>
              </CardHeader>
              <CardContent>
                {redemptions.length === 0 ? (
                  <p className="text-sm text-muted-foreground py-6 text-center">No redemptions yet.</p>
                ) : (
                  <div className="space-y-3">
                    {redemptions.map(r => (
                      <div key={r.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                        <div>
                          <p className="text-sm font-medium text-foreground">{r.reward_name}</p>
                          <p className="text-xs text-muted-foreground">{fmtDateTime(r.created_at)}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-heading font-bold text-destructive">-{r.tokens_spent}</span>
                          <Badge className={statusColor(r.status)}>{r.status}</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="referrals">
            <Card className="shadow-card mb-6">
              <CardHeader>
                <CardTitle className="text-lg">Your Referral Link</CardTitle>
                <CardDescription>Earn 30–50 tokens for each successful referral</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2">
                  <Input readOnly value={`${window.location.origin}/auth?ref=${profile.referral_code ?? ""}`} className="font-mono text-sm" />
                  <Button onClick={copyReferralLink} size="icon" variant="outline"><Copy size={16} /></Button>
                  <Button size="icon" variant="outline"><Share2 size={16} /></Button>
                </div>
              </CardContent>
            </Card>
            <Card className="shadow-card">
              <CardHeader><CardTitle className="text-lg">Your Referrals ({referrals.length})</CardTitle></CardHeader>
              <CardContent>
                {referrals.length === 0 ? (
                  <p className="text-sm text-muted-foreground py-6 text-center">No referrals yet. Share your link to earn tokens.</p>
                ) : (
                  <div className="space-y-3">
                    {referrals.map(ref => (
                      <div key={ref.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-secondary/30 flex items-center justify-center">
                            <User size={14} className="text-secondary-foreground" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-foreground">{ref.name}</p>
                            <p className="text-xs text-muted-foreground">{ref.state} • {fmtDate(ref.date)}</p>
                          </div>
                        </div>
                        <Badge className={statusColor(ref.status)}>{ref.status}</Badge>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Bell size={18} className="text-primary" /> Notification Settings
                </CardTitle>
                <CardDescription>Choose which alerts you want to receive</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-lg border border-border">
                  <div>
                    <p className="font-medium text-foreground">Campaign updates</p>
                    <p className="text-xs text-muted-foreground">News, announcements, and rallies from the campaign team</p>
                  </div>
                  <Switch
                    checked={notifPrefs.campaign_updates}
                    onCheckedChange={(v) => handleNotifToggle("campaign_updates", v)}
                  />
                </div>
                <div className="flex items-center justify-between p-4 rounded-lg border border-border">
                  <div>
                    <p className="font-medium text-foreground">Pledge progress alerts</p>
                    <p className="text-xs text-muted-foreground">Updates as we move toward the 1 million pledge goal</p>
                  </div>
                  <Switch
                    checked={notifPrefs.pledge_progress}
                    onCheckedChange={(v) => handleNotifToggle("pledge_progress", v)}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="profile">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="text-lg">Profile Settings</CardTitle>
                <CardDescription>Update your personal information</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div><Label>Full Name</Label><Input value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} className="mt-1.5" /></div>
                  <div><Label>Email</Label><Input value={profile.email} disabled className="mt-1.5" /></div>
                  <div><Label>Phone</Label><Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="mt-1.5" /></div>
                  <div><Label>State</Label><Input value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} className="mt-1.5" /></div>
                  <div><Label>LGA</Label><Input value={form.lga} onChange={(e) => setForm({ ...form, lga: e.target.value })} className="mt-1.5" /></div>
                  <div><Label>Ward</Label><Input value={form.ward} onChange={(e) => setForm({ ...form, ward: e.target.value })} className="mt-1.5" /></div>
                </div>
                <Button onClick={handleSave} className="mt-6 font-heading font-semibold">Save Changes</Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      <Dialog open={!!selectedPledge} onOpenChange={(o) => !o && setSelectedPledge(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <MapPin size={18} className="text-primary" /> Pledge Details
            </DialogTitle>
            <DialogDescription>Full record of this pledge submission</DialogDescription>
          </DialogHeader>
          {selectedPledge && (
            <div className="space-y-3 mt-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Status</span>
                <Badge className={statusColor(selectedPledge.status)}>{selectedPledge.status}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Tokens earned</span>
                <span className="text-sm font-heading font-bold text-primary">
                  +{selectedPledge.status === "verified" ? 70 : 50}
                </span>
              </div>
              <div className="border-t border-border pt-3 grid grid-cols-2 gap-3 text-sm">
                <div><p className="text-xs text-muted-foreground">Full name</p><p className="font-medium">{selectedPledge.full_name}</p></div>
                <div><p className="text-xs text-muted-foreground">Phone</p><p className="font-medium">{selectedPledge.phone}</p></div>
                <div><p className="text-xs text-muted-foreground">State</p><p className="font-medium">{selectedPledge.state}</p></div>
                <div><p className="text-xs text-muted-foreground">LGA</p><p className="font-medium">{selectedPledge.lga}</p></div>
                <div><p className="text-xs text-muted-foreground">Ward</p><p className="font-medium">{selectedPledge.ward}</p></div>
                <div><p className="text-xs text-muted-foreground">Polling unit</p><p className="font-medium">{selectedPledge.polling_unit}</p></div>
              </div>
              <div className="border-t border-border pt-3 text-sm">
                <p className="text-xs text-muted-foreground">Submitted</p>
                <p className="font-medium">{fmtDateTime(selectedPledge.created_at)}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserDashboard;
