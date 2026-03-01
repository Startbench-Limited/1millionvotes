export interface LgaPledgeData {
  lga: string;
  pledges: number;
  target: number;
  growth: string;
}

export const lgaPledgeData: Record<string, LgaPledgeData> = {
  "Ajingi": { lga: "Ajingi", pledges: 1250, target: 2700, growth: "+5.2%" },
  "Albasu": { lga: "Albasu", pledges: 1589, target: 2700, growth: "+7.1%" },
  "Bagwai": { lga: "Bagwai", pledges: 1823, target: 2700, growth: "+8.3%" },
  "Bebeji": { lga: "Bebeji", pledges: 1467, target: 2700, growth: "+4.9%" },
  "Bichi": { lga: "Bichi", pledges: 2134, target: 2700, growth: "+9.5%" },
  "Bunkure": { lga: "Bunkure", pledges: 892, target: 2700, growth: "+3.8%" },
  "Dala": { lga: "Dala", pledges: 3589, target: 2700, growth: "+12.4%" },
  "Dambatta": { lga: "Dambatta", pledges: 2256, target: 2700, growth: "+10.1%" },
  "Dawakin Kudu": { lga: "Dawakin Kudu", pledges: 1378, target: 2700, growth: "+5.6%" },
  "Dawakin Tofa": { lga: "Dawakin Tofa", pledges: 1654, target: 2700, growth: "+6.2%" },
  "Doguwa": { lga: "Doguwa", pledges: 1023, target: 2700, growth: "+4.1%" },
  "Fagge": { lga: "Fagge", pledges: 3187, target: 2700, growth: "+11.3%" },
  "Gabasawa": { lga: "Gabasawa", pledges: 1156, target: 2700, growth: "+5.3%" },
  "Garko": { lga: "Garko", pledges: 1345, target: 2700, growth: "+4.7%" },
  "Garun Mallam": { lga: "Garun Mallam", pledges: 987, target: 2700, growth: "+3.5%" },
  "Gaya": { lga: "Gaya", pledges: 1678, target: 2700, growth: "+7.4%" },
  "Gezawa": { lga: "Gezawa", pledges: 1189, target: 2700, growth: "+4.5%" },
  "Gwale": { lga: "Gwale", pledges: 3456, target: 2700, growth: "+11.8%" },
  "Gwarzo": { lga: "Gwarzo", pledges: 1945, target: 2700, growth: "+8.7%" },
  "Kabo": { lga: "Kabo", pledges: 1423, target: 2700, growth: "+6.1%" },
  "Kano Municipal": { lga: "Kano Municipal", pledges: 4589, target: 2700, growth: "+14.2%" },
  "Karaye": { lga: "Karaye", pledges: 1567, target: 2700, growth: "+5.9%" },
  "Kibiya": { lga: "Kibiya", pledges: 1089, target: 2700, growth: "+4.3%" },
  "Kiru": { lga: "Kiru", pledges: 1689, target: 2700, growth: "+7.2%" },
  "Kumbotso": { lga: "Kumbotso", pledges: 2893, target: 2700, growth: "+9.8%" },
  "Kunchi": { lga: "Kunchi", pledges: 1234, target: 2700, growth: "+5.0%" },
  "Kura": { lga: "Kura", pledges: 1456, target: 2700, growth: "+6.3%" },
  "Madobi": { lga: "Madobi", pledges: 1623, target: 2700, growth: "+7.0%" },
  "Makoda": { lga: "Makoda", pledges: 1745, target: 2700, growth: "+7.3%" },
  "Minjibir": { lga: "Minjibir", pledges: 1534, target: 2700, growth: "+6.5%" },
  "Nasarawa": { lga: "Nasarawa", pledges: 3215, target: 2700, growth: "+10.5%" },
  "Rano": { lga: "Rano", pledges: 1289, target: 2700, growth: "+5.1%" },
  "Rimin Gado": { lga: "Rimin Gado", pledges: 1567, target: 2700, growth: "+6.8%" },
  "Rogo": { lga: "Rogo", pledges: 1789, target: 2700, growth: "+7.5%" },
  "Shanono": { lga: "Shanono", pledges: 1345, target: 2700, growth: "+5.8%" },
  "Sumaila": { lga: "Sumaila", pledges: 1978, target: 2700, growth: "+8.1%" },
  "Takai": { lga: "Takai", pledges: 1489, target: 2700, growth: "+6.3%" },
  "Tarauni": { lga: "Tarauni", pledges: 2567, target: 2700, growth: "+9.2%" },
  "Tofa": { lga: "Tofa", pledges: 1123, target: 2700, growth: "+4.8%" },
  "Tsanyawa": { lga: "Tsanyawa", pledges: 1356, target: 2700, growth: "+5.7%" },
  "Tudun Wada": { lga: "Tudun Wada", pledges: 2034, target: 2700, growth: "+8.9%" },
  "Ungogo": { lga: "Ungogo", pledges: 2789, target: 2700, growth: "+9.6%" },
  "Warawa": { lga: "Warawa", pledges: 1156, target: 2700, growth: "+4.9%" },
  "Wudil": { lga: "Wudil", pledges: 1489, target: 2700, growth: "+6.4%" },
};

export const getLgaColorScale = (pledges: number): string => {
  if (pledges >= 3500) return "hsl(120, 100%, 20%)";
  if (pledges >= 2500) return "hsl(120, 100%, 28%)";
  if (pledges >= 2000) return "hsl(120, 80%, 35%)";
  if (pledges >= 1500) return "hsl(120, 60%, 45%)";
  if (pledges >= 1000) return "hsl(120, 40%, 58%)";
  return "hsl(120, 25%, 72%)";
};

export const lgaLegendItems = [
  { label: "3,500+", color: "hsl(120, 100%, 20%)" },
  { label: "2,500+", color: "hsl(120, 100%, 28%)" },
  { label: "2,000+", color: "hsl(120, 80%, 35%)" },
  { label: "1,500+", color: "hsl(120, 60%, 45%)" },
  { label: "1,000+", color: "hsl(120, 40%, 58%)" },
  { label: "< 1,000", color: "hsl(120, 25%, 72%)" },
];
