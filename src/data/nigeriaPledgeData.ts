export interface StatePledgeData {
  state: string;
  pledges: number;
  target: number;
  growth: string;
}

export const statePledgeData: Record<string, StatePledgeData> = {
  "Abia": { state: "Abia", pledges: 12450, target: 27000, growth: "+5.2%" },
  "Adamawa": { state: "Adamawa", pledges: 15890, target: 27000, growth: "+7.1%" },
  "Akwa Ibom": { state: "Akwa Ibom", pledges: 18230, target: 27000, growth: "+8.3%" },
  "Anambra": { state: "Anambra", pledges: 14670, target: 27000, growth: "+4.9%" },
  "Bauchi": { state: "Bauchi", pledges: 21340, target: 27000, growth: "+9.5%" },
  "Bayelsa": { state: "Bayelsa", pledges: 8920, target: 27000, growth: "+3.8%" },
  "Benue": { state: "Benue", pledges: 19870, target: 27000, growth: "+6.7%" },
  "Borno": { state: "Borno", pledges: 22560, target: 27000, growth: "+10.1%" },
  "Cross River": { state: "Cross River", pledges: 13780, target: 27000, growth: "+5.6%" },
  "Delta": { state: "Delta", pledges: 16540, target: 27000, growth: "+6.2%" },
  "Ebonyi": { state: "Ebonyi", pledges: 10230, target: 27000, growth: "+4.1%" },
  "Edo": { state: "Edo", pledges: 17890, target: 27000, growth: "+7.8%" },
  "Ekiti": { state: "Ekiti", pledges: 11560, target: 27000, growth: "+5.3%" },
  "Enugu": { state: "Enugu", pledges: 13450, target: 27000, growth: "+4.7%" },
  "Federal Capital Territory": { state: "Abuja FCT", pledges: 25187, target: 27000, growth: "+11.3%" },
  "Gombe": { state: "Gombe", pledges: 16780, target: 27000, growth: "+7.4%" },
  "Imo": { state: "Imo", pledges: 11890, target: 27000, growth: "+4.5%" },
  "Jigawa": { state: "Jigawa", pledges: 19450, target: 27000, growth: "+8.7%" },
  "Kaduna": { state: "Kaduna", pledges: 22341, target: 27000, growth: "+8.1%" },
  "Kano": { state: "Kano", pledges: 38741, target: 27000, growth: "+9.8%" },
  "Katsina": { state: "Katsina", pledges: 24560, target: 27000, growth: "+9.2%" },
  "Kebbi": { state: "Kebbi", pledges: 14230, target: 27000, growth: "+6.1%" },
  "Kogi": { state: "Kogi", pledges: 15670, target: 27000, growth: "+5.9%" },
  "Kwara": { state: "Kwara", pledges: 16890, target: 27000, growth: "+7.2%" },
  "Lagos": { state: "Lagos", pledges: 45892, target: 27000, growth: "+12.4%" },
  "Nassarawa": { state: "Nassarawa", pledges: 13560, target: 27000, growth: "+5.8%" },
  "Niger": { state: "Niger", pledges: 18920, target: 27000, growth: "+7.6%" },
  "Ogun": { state: "Ogun", pledges: 19780, target: 27000, growth: "+8.1%" },
  "Ondo": { state: "Ondo", pledges: 14890, target: 27000, growth: "+6.3%" },
  "Osun": { state: "Osun", pledges: 16230, target: 27000, growth: "+7.0%" },
  "Oyo": { state: "Oyo", pledges: 28493, target: 27000, growth: "+7.6%" },
  "Plateau": { state: "Plateau", pledges: 17450, target: 27000, growth: "+7.3%" },
  "Rivers": { state: "Rivers", pledges: 32156, target: 27000, growth: "+15.2%" },
  "Sokoto": { state: "Sokoto", pledges: 20340, target: 27000, growth: "+8.9%" },
  "Taraba": { state: "Taraba", pledges: 12890, target: 27000, growth: "+5.1%" },
  "Yobe": { state: "Yobe", pledges: 15670, target: 27000, growth: "+6.8%" },
  "Zamfara": { state: "Zamfara", pledges: 17890, target: 27000, growth: "+7.5%" },
};

export const getColorScale = (pledges: number): string => {
  if (pledges >= 35000) return "hsl(120, 100%, 20%)";
  if (pledges >= 25000) return "hsl(120, 100%, 28%)";
  if (pledges >= 20000) return "hsl(120, 80%, 35%)";
  if (pledges >= 15000) return "hsl(120, 60%, 45%)";
  if (pledges >= 10000) return "hsl(120, 40%, 58%)";
  return "hsl(120, 25%, 72%)";
};

export const legendItems = [
  { label: "35,000+", color: "hsl(120, 100%, 20%)" },
  { label: "25,000+", color: "hsl(120, 100%, 28%)" },
  { label: "20,000+", color: "hsl(120, 80%, 35%)" },
  { label: "15,000+", color: "hsl(120, 60%, 45%)" },
  { label: "10,000+", color: "hsl(120, 40%, 58%)" },
  { label: "< 10,000", color: "hsl(120, 25%, 72%)" },
];
