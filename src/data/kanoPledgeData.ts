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

// Real Kano State council wards per INEC / Soluap (Oct 2024)
const lgaWardNames: Record<string, string[]> = {
  "Ajingi": ["Ajingi", "Balare", "Chula", "Dabin Kanawa", "Dundun", "Gafasa", "Gurduba", "Kunkurawa", "Toranke", "Ungawar Bai"],
  "Albasu": ["Albasu Central", "Bataiya", "Chamarana", "Daho", "Fanda", "Faragai", "Gagarame", "Hungu", "Saya-Saya", "Tsangaya"],
  "Bagwai": ["Bagwai", "Dangada", "Gadanya", "Gogori", "Kiyawa", "Kwajali", "Rimin Dako", "Romo", "Sare-Sare", "Wuro Bagga"],
  "Bebeji": ["Anadariya", "Baguda", "Bebeji", "Damau", "Durmawa", "Gargai", "Gwarmai", "Kofa", "Kuki", "Rahama", "Ranka", "Rantan", "Tariwa", "Wak"],
  "Bichi": ["Badume", "Bichi", "Danzabuwa", "Fagolo", "Kaukau", "Kwamarawa", "Kyalli", "Muntsira", "Saye", "Waire", "Yallami"],
  "Bunkure": ["Barkum", "Bono", "Bunkure", "Chirin", "Gafan", "Gurjiya", "Gwamma", "Kulluwa", "Kumurya", "Sanda"],
  "Dala": ["Adakawa", "Bakin Ruwa", "Dala", "Dogon Nama", "Gobirawa", "Gwammaja", "Kabuwaya", "Kantudu", "Kofar Mazugal", "Kofar Ruwa", "Madigawa", "Yalwa"],
  "Dambatta": ["Ajumawa", "Danbatta East", "Danbatta West", "Fagwalawa", "Goron Maje", "Gwanda", "Gwarabjawa", "Kore", "Saidawa", "Sansan"],
  "Dawakin Kudu": ["Dabar Kwari", "Danbagiwa", "Dawaki", "Dawakiji", "Dosan", "Gano", "Gurjiya", "Jido", "Tamburawa", "Tsakuwa", "Unguwar Duniya", "Yanbarau", "Yankatsari", "Yargaya", "Zogarawa"],
  "Dawakin Tofa": ["Dan Guguwa", "Dawaki East", "Dawaki West", "Dawanau", "Ganduje", "Gargari", "Jalli", "Kwa", "Marke", "Tattarawa", "Tumfafi"],
  "Doguwa": ["Dariya", "Dogon Kawo", "Duguwa", "Falgore", "Maraku", "Ragada", "Ririwai", "Tagwaye", "Unguwar Natsohuwa", "Zainabi"],
  "Fagge": ["Fagge A", "Fagge B", "Fagge C", "Fagge D", "Fagge E", "Kwachiri", "Rijiyar Lemo", "Sabongari East", "Sabongari West", "Yammata"],
  "Gabasawa": ["Gabasawa", "Garun Danga", "Joda", "Karmaki", "Mekiya", "Tarauni", "Yantar Arewwa", "Yautar Kudu", "Yumbu", "Zakirai", "Zugachi"],
  "Garko": ["Dal", "Garin Ali", "Garko", "Gurjiya", "Kafin Malamai", "Katumari", "Kwas", "Raba", "Sarina", "Zakarawa"],
  "Garun Mallam": ["Chiromawa", "Dorawar-Sallau", "Fankurun", "Garun Babba", "Garun Malam", "Jobawa", "Kadawa", "Makwaro", "Yad Akwari", "Yalwan Yadakwari"],
  "Gaya": ["Balan", "Gamarya", "Gamoji", "Gaya Arewa", "Gaya Kudu", "Kademi", "Kazurawa", "Maimakawa", "Shagogo", "Wudilawa"],
  "Gezawa": ["Babawa", "Gawo", "Gezawa", "Jogana", "Ketawa", "Mesar-Tudu", "Sararin-Gezawa", "Tsamiya-Babba", "Tumbau", "Wangara", "Zango"],
  "Gwale": ["Dandago", "Diso", "Dorayi", "Galadanchi", "Goron Dutse", "Gwale", "Gyaranya", "Kabuga", "Mandawari", "Sani Mai Magge"],
  "Gwarzo": ["Getso", "Gwarzo", "Jama'a", "Kara", "Kutama", "Lakwaya", "Madadi", "Mainika", "Sabon Birni", "Unguwar Tudu"],
  "Kabo": ["Dugabau", "Durun", "Gammo", "Garo", "Godiya", "Gude", "Hauwade", "Kabo", "Kanwa", "Masanawa"],
  "Kano Municipal": ["Chedi", "Dan'Agundi", "Gandun Albasa", "Jakara", "Kankarofi", "Shahuchi", "Sharada", "Sheshe", "Tudun Nufawa", "Tudun Wazirchi", "Yakasai", "Zaitawa", "Zango"],
  "Karaye": ["Daura", "Kafin Dafga", "Karaye", "Kurugu", "Kwanyawa", "Tudun Kaya", "Turawa", "Unguwar Hajji", "Yammedi", "Yola"],
  "Kibiya": ["Durba", "Fammar", "Fassi", "Kadigawa", "Kahu", "Kibiya I", "Kibiya II", "Nariya", "Tarai", "Unguwar Gai"],
  "Kiru": ["Ba'Awa", "Badafi", "Bargoni", "Bauda", "Dangora", "Dansohiya", "Dashi", "Galadimawa", "Kiru", "Kogo", "Maraku", "Tsaudawa", "Yako", "Yalwa", "Zuwo"],
  "Kumbotso": ["Challawa", "Chiranchi", "Danbare", "Danmaliki", "Guringawa", "Kumbotso", "Kureken Sani", "Mariri", "Na'Ibawa", "Panshekara", "Unguwar Rimi"],
  "Kunchi": ["Bumai", "Garin Sheme", "Gwarmai", "Kasuwar Kuka", "Kunchi", "Matan Fada", "Ridawa", "Shamakawa", "Shuwaki", "Yandadi"],
  "Kura": ["Dalili", "Dan Hassan", "Dukawa", "Gundutse", "Karfi", "Kosawa", "Kura", "Kurunsumau", "Rigar Duka", "Tanawa"],
  "Madobi": ["Burji", "Cinkoso", "Galinja", "Gora", "Kafin Agur", "Kanwa", "Kaura Mata", "Kubaraci", "Kwankwaso", "Madobi", "Rikadawa"],
  "Makoda": ["Babbar Riga", "Durma", "Jibga", "Kadandani", "Koguna", "Koren Tatso", "Maitsidau", "Makoda", "Satame", "Tangaji", "Wailare"],
  "Minjibir": ["Azore", "Gandurwawa", "Kantama", "Kunya", "Kuru", "Kwarkiya", "Minjibir", "Sarbi", "Tsakiya", "Tsakuwa", "Wasai"],
  "Nasarawa": ["Dakata", "Gama", "Gawuna", "Giginyu", "Gwagwarwa", "Hotoro North", "Hotoro South", "Kaura Goje", "Kawaji", "Tudun Murtala", "Tudun Wada"],
  "Rano": ["Dawaki", "Lausu", "Madachi", "Rano", "Rurum Sabon-Gari", "Rurum Tsohon-Gari", "Saji", "Yalwa", "Zinyau", "Zurgu"],
  "Rimin Gado": ["Butu-Butu", "Dawaki Gulu", "Doka Dawa", "Dugurawa", "Gulu", "Jili", "Karofin Yashi", "Rimin Gado", "Sakaratsa", "Tamawa", "Yalwan Danziyal", "Zango Dan Abdu"],
  "Rogo": ["Beli", "Falgore", "Fulatan", "Gwangwan", "Jajaye", "Rogo Ruma", "Rogo Sabon Gari", "Ruwan Bago", "Zarewa", "Zoza"],
  "Shanono": ["Alajawa", "Dutsen-Bakoshi", "Faruruwa", "Goron Dutse", "Kadamu", "Kokiya", "Leni", "Shakogi", "Shanono", "Tsaure"],
  "Sumaila": ["Gala", "Gani", "Garfa", "Gediya", "Kanawa", "Magami", "Masu", "Rimi", "Rumo", "Sitti", "Sumaila"],
  "Takai": ["Bagwaro", "Durbunde", "Fajewa", "Falali", "Faruruwa", "Kachako", "Karfi", "Kuka", "Takai", "Zuga"],
  "Tarauni": ["Babban Giji", "Darmanawa", "Daurawa", "Gyadi-Gyadi Arewa", "Gyadi-Gyadi Kudu", "Hotoro (NNPC)", "Kauyen Alu", "Tarauni", "Unguwa Uku", "Unguwar Gano"],
  "Tofa": ["Dindere", "Doka", "Gajida", "Ginsawa", "Janguza", "Jauben Kudu", "Kwami", "Lambu", "Langel", "Tofa", "Unguwar Rimi", "Wangara", "Yalwa Karama", "Yanoko", "Yarimawa"],
  "Tsanyawa": ["Daddarawa", "Dunbulun", "Gozaki", "Gurun", "Kabagiwa", "Tatsan", "Tsanyawa", "Yanganau", "Yankamaye", "Zarogi"],
  "Tudun Wada": ["Baburi", "Burumburum", "Dalawa", "Jandutse", "Jita", "Karefa", "Nata'Ala", "Sabon Gari", "Shuwaki", "Tsohogari"],
  "Ungogo": ["Bachirawa", "Gayawa", "Kadawa", "Karo", "Panisau", "Rangaza", "Rijiyar Zaki", "Tudun Fulani", "Ungogo", "Yadakunya", "Zango"],
  "Warawa": ["Amarawa", "Danlasan", "Garin Dau", "Gogel", "Imawa", "J/Galadima", "Jemagu", "Jigawa", "Katarkawa", "Madari Mata", "Tamburawar Gabas", "Tangar", "Warawa", "'Yan Dalla", "'Yangizo"],
  "Wudil": ["Achika", "Dagumawa", "Dankaza", "Darki", "Indabo", "Kausani", "Lajawa", "Sabon Gari", "Utai", "Wudil"],
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
