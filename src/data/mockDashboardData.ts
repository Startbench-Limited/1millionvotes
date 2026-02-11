// ============ USER DASHBOARD MOCK DATA ============

export const mockUser = {
  id: "usr_001",
  name: "Adebayo Ogunlesi",
  email: "adebayo@example.com",
  phone: "+234 801 234 5678",
  state: "Lagos",
  lga: "Ikeja",
  ward: "Ward 5",
  avatarInitials: "AO",
  joinedDate: "2025-11-15",
  pledgeStatus: "verified" as const,
  referralCode: "ADEBAYO2027",
  rewardTokens: 350,
};

export const mockPledgeHistory = [
  { id: 1, action: "Pledge registered", date: "2025-11-15", tokens: 50 },
  { id: 2, action: "Email verified", date: "2025-11-15", tokens: 20 },
  { id: 3, action: "Referred Chika Nwosu", date: "2025-12-01", tokens: 30 },
  { id: 4, action: "Attended Lagos rally", date: "2025-12-10", tokens: 100 },
  { id: 5, action: "Referred Musa Ibrahim", date: "2026-01-05", tokens: 30 },
  { id: 6, action: "Completed canvassing task", date: "2026-01-20", tokens: 50 },
  { id: 7, action: "Shared on social media", date: "2026-02-01", tokens: 20 },
  { id: 8, action: "Referred Funke Adeyemi", date: "2026-02-08", tokens: 50 },
];

export const mockReferrals = [
  { id: 1, name: "Chika Nwosu", state: "Anambra", date: "2025-12-01", status: "verified" as const },
  { id: 2, name: "Musa Ibrahim", state: "Kano", date: "2026-01-05", status: "verified" as const },
  { id: 3, name: "Funke Adeyemi", state: "Oyo", date: "2026-02-08", status: "pending" as const },
  { id: 4, name: "Emeka Obi", state: "Enugu", date: "2026-02-10", status: "pending" as const },
];

export const mockVolunteerTasks = [
  { id: 1, title: "Door-to-door canvassing – Ikeja Ward 5", dueDate: "2026-02-15", status: "completed" as const, tokens: 50 },
  { id: 2, title: "Social media campaign – Share 10 posts", dueDate: "2026-02-20", status: "in_progress" as const, tokens: 30 },
  { id: 3, title: "Attend town hall meeting – Lagos", dueDate: "2026-02-25", status: "upcoming" as const, tokens: 100 },
  { id: 4, title: "Register 5 new pledges in your ward", dueDate: "2026-03-01", status: "upcoming" as const, tokens: 75 },
  { id: 5, title: "Distribute campaign flyers – 200 units", dueDate: "2026-03-05", status: "upcoming" as const, tokens: 40 },
];

export const mockRewardTiers = [
  { name: "Patriot", minTokens: 0, maxTokens: 99, color: "hsl(120, 20%, 50%)" },
  { name: "Champion", minTokens: 100, maxTokens: 299, color: "hsl(120, 60%, 40%)" },
  { name: "Ambassador", minTokens: 300, maxTokens: 599, color: "hsl(120, 80%, 30%)" },
  { name: "Legend", minTokens: 600, maxTokens: Infinity, color: "hsl(39, 100%, 50%)" },
];

// ============ ADMIN DASHBOARD MOCK DATA ============

export const mockAdminStats = {
  totalPledges: 847329,
  verifiedPledges: 712456,
  todayPledges: 2341,
  weekGrowth: 4.7,
  totalVolunteers: 12483,
  activeVolunteers: 8291,
  totalTokensIssued: 4250000,
  avgTokensPerUser: 5.02,
};

export const mockPledgeTrend = [
  { month: "Sep", pledges: 45000 },
  { month: "Oct", pledges: 98000 },
  { month: "Nov", pledges: 156000 },
  { month: "Dec", pledges: 210000 },
  { month: "Jan", pledges: 185000 },
  { month: "Feb", pledges: 153329 },
];

export const mockTopStates = [
  { state: "Lagos", pledges: 124500, percentage: 14.7 },
  { state: "Kano", pledges: 98200, percentage: 11.6 },
  { state: "Rivers", pledges: 72400, percentage: 8.5 },
  { state: "FCT", pledges: 65800, percentage: 7.8 },
  { state: "Oyo", pledges: 58300, percentage: 6.9 },
  { state: "Kaduna", pledges: 52100, percentage: 6.1 },
  { state: "Delta", pledges: 44700, percentage: 5.3 },
  { state: "Anambra", pledges: 39200, percentage: 4.6 },
];

export const mockAdminUsers = [
  { id: "usr_001", name: "Adebayo Ogunlesi", email: "adebayo@example.com", state: "Lagos", pledgeDate: "2025-11-15", status: "verified" as const, referrals: 4, tokens: 350 },
  { id: "usr_002", name: "Fatima Bello", email: "fatima@example.com", state: "Kano", pledgeDate: "2025-11-18", status: "verified" as const, referrals: 12, tokens: 890 },
  { id: "usr_003", name: "Chidi Okafor", email: "chidi@example.com", state: "Anambra", pledgeDate: "2025-12-01", status: "verified" as const, referrals: 7, tokens: 520 },
  { id: "usr_004", name: "Amina Yusuf", email: "amina@example.com", state: "Kaduna", pledgeDate: "2025-12-10", status: "pending" as const, referrals: 2, tokens: 100 },
  { id: "usr_005", name: "Tunde Bakare", email: "tunde@example.com", state: "Oyo", pledgeDate: "2026-01-05", status: "verified" as const, referrals: 9, tokens: 670 },
  { id: "usr_006", name: "Ngozi Eze", email: "ngozi@example.com", state: "Enugu", pledgeDate: "2026-01-12", status: "suspended" as const, referrals: 0, tokens: 50 },
  { id: "usr_007", name: "Ibrahim Musa", email: "ibrahim@example.com", state: "Borno", pledgeDate: "2026-01-20", status: "verified" as const, referrals: 15, tokens: 1200 },
  { id: "usr_008", name: "Blessing Udo", email: "blessing@example.com", state: "Rivers", pledgeDate: "2026-02-01", status: "pending" as const, referrals: 1, tokens: 80 },
];

export const mockVolunteerCoordination = [
  { id: 1, task: "Lagos Rally Organization", assignedTo: 45, completed: 38, state: "Lagos", deadline: "2026-02-20" },
  { id: 2, task: "Kano Door-to-Door Campaign", assignedTo: 60, completed: 22, state: "Kano", deadline: "2026-02-25" },
  { id: 3, task: "Social Media Blitz – Nationwide", assignedTo: 200, completed: 145, state: "All", deadline: "2026-03-01" },
  { id: 4, task: "FCT Town Hall Preparation", assignedTo: 30, completed: 10, state: "FCT", deadline: "2026-03-05" },
  { id: 5, task: "Rivers State Youth Outreach", assignedTo: 25, completed: 25, state: "Rivers", deadline: "2026-02-15" },
];

export const mockCampaignContent = [
  { id: 1, type: "news" as const, title: "Lagos surpasses 100,000 pledges!", date: "2026-02-10", status: "published" as const },
  { id: 2, type: "news" as const, title: "Campaign reaches 800K milestone", date: "2026-02-08", status: "published" as const },
  { id: 3, type: "gallery" as const, title: "Kano rally photos – Feb 2026", date: "2026-02-05", status: "published" as const },
  { id: 4, type: "news" as const, title: "New volunteer rewards program launched", date: "2026-02-01", status: "draft" as const },
  { id: 5, type: "gallery" as const, title: "Women empowerment event – Abuja", date: "2026-01-28", status: "published" as const },
  { id: 6, type: "news" as const, title: "Youth engagement summit recap", date: "2026-01-25", status: "draft" as const },
];
