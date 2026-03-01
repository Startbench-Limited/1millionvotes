export interface WardPledgeData {
  ward: string;
  pledges: number;
  target: number;
  growth: string;
}

export interface LgaPledgeData {
  lga: string;
  pledges: number;
  target: number;
  growth: string;
  wards: WardPledgeData[];
}

const generateWards = (lgaName: string, totalPledges: number, wardNames: string[]): WardPledgeData[] => {
  const basePerWard = Math.floor(totalPledges / wardNames.length);
  let remaining = totalPledges;
  return wardNames.map((name, i) => {
    const isLast = i === wardNames.length - 1;
    const pledges = isLast ? remaining : Math.floor(basePerWard * (0.7 + Math.random() * 0.6));
    remaining -= pledges;
    return {
      ward: name,
      pledges: Math.max(pledges, 10),
      target: Math.floor(2700 / wardNames.length),
      growth: `+${(3 + Math.random() * 8).toFixed(1)}%`,
    };
  });
};

const lgaWardNames: Record<string, string[]> = {
  "Ajingi": ["Ajingi", "Garzago", "Kazurawa", "Fankurun", "Garfa"],
  "Albasu": ["Albasu", "Bagesha", "Hungu", "Joda", "Charama"],
  "Bagwai": ["Bagwai", "Gogel", "Kafin Agur", "Wuro Bagga", "Jalli"],
  "Bebeji": ["Bebeji", "Durmawa", "Tantama", "Jibawa", "Mazoji"],
  "Bichi": ["Bichi", "Badume", "Dashi", "Kyalli", "Saye"],
  "Bunkure": ["Bunkure", "Jangargari", "Zainabi", "Gundutse", "Yalwan Danziyal"],
  "Dala": ["Dala", "Gwammaja", "Dogon Nama", "Kofar Mazugal", "Mandawari", "Kantudu"],
  "Dambatta": ["Dambatta", "Ajumawa", "Dunbulu", "Garfa", "Makoda"],
  "Dawakin Kudu": ["Dawakin Kudu", "Dawaki", "Galadanci", "Madobi", "Riruwai"],
  "Dawakin Tofa": ["Dawakin Tofa", "Dawanau", "Gano", "Kafin Agur", "Malikawa"],
  "Doguwa": ["Doguwa", "Bagwaro", "Dunbulwa", "Iyawa", "Tarfa"],
  "Fagge": ["Fagge", "Kwari", "Sabon Gari", "Fagge D2", "Rijiyar Zaki", "Kantudu"],
  "Gabasawa": ["Gabasawa", "Jalli", "Kadawa", "Zakirai", "Wudilawa"],
  "Garko": ["Garko", "Gurjiya", "Sarina", "Yalwan Garkuwa", "Kamaru"],
  "Garun Mallam": ["Garun Mallam", "Garin Dau", "Chiranchi", "Fansau", "Kafin Malamai"],
  "Gaya": ["Gaya", "Kademi", "Maimakawa", "Gamoji", "Zuwo"],
  "Gezawa": ["Gezawa", "Gazetai", "Jogana", "Babban Tasha", "Kasuwar Kogi"],
  "Gwale": ["Gwale", "Goron Dutse", "Dorayi", "Gyadi-Gyadi", "Filin Hockey", "Yankaba"],
  "Gwarzo": ["Gwarzo", "Getso", "Sabon Garin Gwarzo", "Madachi", "Unguwar Jaki"],
  "Kabo": ["Kabo", "Gammo", "Karfi", "Doka", "Kauyen Babba"],
  "Kano Municipal": ["Kofar Wambai", "Jakara", "Kofar Kudu", "Kofar Nassarawa", "Dandago", "Shahuchi", "Zango"],
  "Karaye": ["Karaye", "Kafin Agur", "Ruggar Ardo", "Gani", "Kauyen Dawa"],
  "Kibiya": ["Kibiya", "Gadar Tamburawa", "Danladi", "Kwankwaso", "Tsakuwa"],
  "Kiru": ["Kiru", "Bagwaro", "Dangora", "Karfi", "Tsaudawa"],
  "Kumbotso": ["Kumbotso", "Chiranci", "Dan Bare", "Unguwar Rimi", "Panshekara", "Mariri"],
  "Kunchi": ["Kunchi", "Kiru", "Shanono", "Yamma", "Garin Baka"],
  "Kura": ["Kura", "Karaye", "Dan Hassan", "Kauyen Kudu", "Garun Danga"],
  "Madobi": ["Madobi", "Gora", "Kafin Maiyaki", "Sabuwar Kahu", "Tsiga"],
  "Makoda": ["Makoda", "Dankama", "Hungu", "Daneji", "Yandadi"],
  "Minjibir": ["Minjibir", "Kunya", "Wasai", "Tartsa", "Minjibir Gabas"],
  "Nasarawa": ["Nasarawa", "Giginyu", "Kaura Goje", "Tudun Maliki", "Hotoro", "Gwagwarwa"],
  "Rano": ["Rano", "Rurum", "Sarina", "Yalwan Dangwanki", "Kwanyawa"],
  "Rimin Gado": ["Rimin Gado", "Diso", "Gulu", "Jili", "Gama"],
  "Rogo": ["Rogo", "Falgore", "Kayawa", "Rugan Doruwa", "Gani"],
  "Shanono": ["Shanono", "Bagwai", "Tsuntsaye", "Kiyawa", "Yardaje"],
  "Sumaila": ["Sumaila", "Garfa", "Masu", "Kadawa", "Gani"],
  "Takai": ["Takai", "Fajewa", "Gani", "Kuchimbawa", "Tsakuwa"],
  "Tarauni": ["Tarauni", "Unguwar Uku", "Babban Layi", "Gyadi-Gyadi", "Filin Mushe"],
  "Tofa": ["Tofa", "Dan Amar", "Gayau", "Rimaye", "Daurawa"],
  "Tsanyawa": ["Tsanyawa", "Kazurawa", "Kuki", "Yardaje", "Magami"],
  "Tudun Wada": ["Tudun Wada", "Kauyen Yamma", "Garin Alhaji", "Sabuwar Unguwa", "Makera"],
  "Ungogo": ["Ungogo", "Rangaza", "Unguwar Rimi", "Zango", "Rijiyar Lemo", "Bachirawa"],
  "Warawa": ["Warawa", "Gama", "Kafin Agur", "Kausani", "Utai"],
  "Wudil": ["Wudil", "Darki", "Dagumawa", "Indabo", "Kwa"],
};

export const lgaPledgeData: Record<string, LgaPledgeData> = {
  "Ajingi": { lga: "Ajingi", pledges: 1250, target: 2700, growth: "+5.2%", wards: generateWards("Ajingi", 1250, lgaWardNames["Ajingi"]) },
  "Albasu": { lga: "Albasu", pledges: 1589, target: 2700, growth: "+7.1%", wards: generateWards("Albasu", 1589, lgaWardNames["Albasu"]) },
  "Bagwai": { lga: "Bagwai", pledges: 1823, target: 2700, growth: "+8.3%", wards: generateWards("Bagwai", 1823, lgaWardNames["Bagwai"]) },
  "Bebeji": { lga: "Bebeji", pledges: 1467, target: 2700, growth: "+4.9%", wards: generateWards("Bebeji", 1467, lgaWardNames["Bebeji"]) },
  "Bichi": { lga: "Bichi", pledges: 2134, target: 2700, growth: "+9.5%", wards: generateWards("Bichi", 2134, lgaWardNames["Bichi"]) },
  "Bunkure": { lga: "Bunkure", pledges: 892, target: 2700, growth: "+3.8%", wards: generateWards("Bunkure", 892, lgaWardNames["Bunkure"]) },
  "Dala": { lga: "Dala", pledges: 3589, target: 2700, growth: "+12.4%", wards: generateWards("Dala", 3589, lgaWardNames["Dala"]) },
  "Dambatta": { lga: "Dambatta", pledges: 2256, target: 2700, growth: "+10.1%", wards: generateWards("Dambatta", 2256, lgaWardNames["Dambatta"]) },
  "Dawakin Kudu": { lga: "Dawakin Kudu", pledges: 1378, target: 2700, growth: "+5.6%", wards: generateWards("Dawakin Kudu", 1378, lgaWardNames["Dawakin Kudu"]) },
  "Dawakin Tofa": { lga: "Dawakin Tofa", pledges: 1654, target: 2700, growth: "+6.2%", wards: generateWards("Dawakin Tofa", 1654, lgaWardNames["Dawakin Tofa"]) },
  "Doguwa": { lga: "Doguwa", pledges: 1023, target: 2700, growth: "+4.1%", wards: generateWards("Doguwa", 1023, lgaWardNames["Doguwa"]) },
  "Fagge": { lga: "Fagge", pledges: 3187, target: 2700, growth: "+11.3%", wards: generateWards("Fagge", 3187, lgaWardNames["Fagge"]) },
  "Gabasawa": { lga: "Gabasawa", pledges: 1156, target: 2700, growth: "+5.3%", wards: generateWards("Gabasawa", 1156, lgaWardNames["Gabasawa"]) },
  "Garko": { lga: "Garko", pledges: 1345, target: 2700, growth: "+4.7%", wards: generateWards("Garko", 1345, lgaWardNames["Garko"]) },
  "Garun Mallam": { lga: "Garun Mallam", pledges: 987, target: 2700, growth: "+3.5%", wards: generateWards("Garun Mallam", 987, lgaWardNames["Garun Mallam"]) },
  "Gaya": { lga: "Gaya", pledges: 1678, target: 2700, growth: "+7.4%", wards: generateWards("Gaya", 1678, lgaWardNames["Gaya"]) },
  "Gezawa": { lga: "Gezawa", pledges: 1189, target: 2700, growth: "+4.5%", wards: generateWards("Gezawa", 1189, lgaWardNames["Gezawa"]) },
  "Gwale": { lga: "Gwale", pledges: 3456, target: 2700, growth: "+11.8%", wards: generateWards("Gwale", 3456, lgaWardNames["Gwale"]) },
  "Gwarzo": { lga: "Gwarzo", pledges: 1945, target: 2700, growth: "+8.7%", wards: generateWards("Gwarzo", 1945, lgaWardNames["Gwarzo"]) },
  "Kabo": { lga: "Kabo", pledges: 1423, target: 2700, growth: "+6.1%", wards: generateWards("Kabo", 1423, lgaWardNames["Kabo"]) },
  "Kano Municipal": { lga: "Kano Municipal", pledges: 4589, target: 2700, growth: "+14.2%", wards: generateWards("Kano Municipal", 4589, lgaWardNames["Kano Municipal"]) },
  "Karaye": { lga: "Karaye", pledges: 1567, target: 2700, growth: "+5.9%", wards: generateWards("Karaye", 1567, lgaWardNames["Karaye"]) },
  "Kibiya": { lga: "Kibiya", pledges: 1089, target: 2700, growth: "+4.3%", wards: generateWards("Kibiya", 1089, lgaWardNames["Kibiya"]) },
  "Kiru": { lga: "Kiru", pledges: 1689, target: 2700, growth: "+7.2%", wards: generateWards("Kiru", 1689, lgaWardNames["Kiru"]) },
  "Kumbotso": { lga: "Kumbotso", pledges: 2893, target: 2700, growth: "+9.8%", wards: generateWards("Kumbotso", 2893, lgaWardNames["Kumbotso"]) },
  "Kunchi": { lga: "Kunchi", pledges: 1234, target: 2700, growth: "+5.0%", wards: generateWards("Kunchi", 1234, lgaWardNames["Kunchi"]) },
  "Kura": { lga: "Kura", pledges: 1456, target: 2700, growth: "+6.3%", wards: generateWards("Kura", 1456, lgaWardNames["Kura"]) },
  "Madobi": { lga: "Madobi", pledges: 1623, target: 2700, growth: "+7.0%", wards: generateWards("Madobi", 1623, lgaWardNames["Madobi"]) },
  "Makoda": { lga: "Makoda", pledges: 1745, target: 2700, growth: "+7.3%", wards: generateWards("Makoda", 1745, lgaWardNames["Makoda"]) },
  "Minjibir": { lga: "Minjibir", pledges: 1534, target: 2700, growth: "+6.5%", wards: generateWards("Minjibir", 1534, lgaWardNames["Minjibir"]) },
  "Nasarawa": { lga: "Nasarawa", pledges: 3215, target: 2700, growth: "+10.5%", wards: generateWards("Nasarawa", 3215, lgaWardNames["Nasarawa"]) },
  "Rano": { lga: "Rano", pledges: 1289, target: 2700, growth: "+5.1%", wards: generateWards("Rano", 1289, lgaWardNames["Rano"]) },
  "Rimin Gado": { lga: "Rimin Gado", pledges: 1567, target: 2700, growth: "+6.8%", wards: generateWards("Rimin Gado", 1567, lgaWardNames["Rimin Gado"]) },
  "Rogo": { lga: "Rogo", pledges: 1789, target: 2700, growth: "+7.5%", wards: generateWards("Rogo", 1789, lgaWardNames["Rogo"]) },
  "Shanono": { lga: "Shanono", pledges: 1345, target: 2700, growth: "+5.8%", wards: generateWards("Shanono", 1345, lgaWardNames["Shanono"]) },
  "Sumaila": { lga: "Sumaila", pledges: 1978, target: 2700, growth: "+8.1%", wards: generateWards("Sumaila", 1978, lgaWardNames["Sumaila"]) },
  "Takai": { lga: "Takai", pledges: 1489, target: 2700, growth: "+6.3%", wards: generateWards("Takai", 1489, lgaWardNames["Takai"]) },
  "Tarauni": { lga: "Tarauni", pledges: 2567, target: 2700, growth: "+9.2%", wards: generateWards("Tarauni", 2567, lgaWardNames["Tarauni"]) },
  "Tofa": { lga: "Tofa", pledges: 1123, target: 2700, growth: "+4.8%", wards: generateWards("Tofa", 1123, lgaWardNames["Tofa"]) },
  "Tsanyawa": { lga: "Tsanyawa", pledges: 1356, target: 2700, growth: "+5.7%", wards: generateWards("Tsanyawa", 1356, lgaWardNames["Tsanyawa"]) },
  "Tudun Wada": { lga: "Tudun Wada", pledges: 2034, target: 2700, growth: "+8.9%", wards: generateWards("Tudun Wada", 2034, lgaWardNames["Tudun Wada"]) },
  "Ungogo": { lga: "Ungogo", pledges: 2789, target: 2700, growth: "+9.6%", wards: generateWards("Ungogo", 2789, lgaWardNames["Ungogo"]) },
  "Warawa": { lga: "Warawa", pledges: 1156, target: 2700, growth: "+4.9%", wards: generateWards("Warawa", 1156, lgaWardNames["Warawa"]) },
  "Wudil": { lga: "Wudil", pledges: 1489, target: 2700, growth: "+6.4%", wards: generateWards("Wudil", 1489, lgaWardNames["Wudil"]) },
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
