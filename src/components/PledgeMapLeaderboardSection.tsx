import { useState, useMemo, useRef, useCallback } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import {
  ComposableMap,
  Geographies,
  Geography,
} from "react-simple-maps";
import { lgaPledgeData, getLgaColorScale, lgaLegendItems, LgaPledgeData, WardPledgeData } from "@/data/kanoPledgeData";
import { MapPin, TrendingUp, Trophy, Medal, Award, Search, ChevronLeft, ChevronRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import MapBottomSheet from "@/components/MapBottomSheet";

const GEO_URL = "/kano-lgas.json";

const allLeaderboard = [
  { rank: 1, lga: "Kano Municipal", ward: "Kano Municipal Central", pledges: 4589, growth: "+14.2%", icon: Trophy },
  { rank: 2, lga: "Dala", ward: "Dala Central", pledges: 3589, growth: "+12.4%", icon: Medal },
  { rank: 3, lga: "Gwale", ward: "Gwale Central", pledges: 3456, growth: "+11.8%", icon: Award },
  { rank: 4, lga: "Nasarawa", ward: "Nasarawa Central", pledges: 3215, growth: "+10.5%", icon: TrendingUp },
  { rank: 5, lga: "Fagge", ward: "Fagge Central", pledges: 3187, growth: "+11.3%", icon: TrendingUp },
  { rank: 6, lga: "Kumbotso", ward: "Kumbotso Central", pledges: 2893, growth: "+9.8%", icon: TrendingUp },
  { rank: 7, lga: "Ungogo", ward: "Ungogo Central", pledges: 2789, growth: "+9.6%", icon: TrendingUp },
  { rank: 8, lga: "Tarauni", ward: "Tarauni Central", pledges: 2567, growth: "+9.2%", icon: TrendingUp },
  { rank: 9, lga: "Dambatta", ward: "Dambatta Central", pledges: 2256, growth: "+10.1%", icon: TrendingUp },
  { rank: 10, lga: "Bichi", ward: "Bichi Central", pledges: 2134, growth: "+9.5%", icon: TrendingUp },
];

const rankColors = [
  "bg-gradient-primary text-primary-foreground",
  "bg-secondary text-secondary-foreground",
  "bg-alert text-alert-foreground",
];

const WardDrillDown = ({ data, onBack }: { data: LgaPledgeData; onBack: () => void }) => {
  const sortedWards = useMemo(() => 
    [...data.wards].sort((a, b) => b.pledges - a.pledges), 
    [data.wards]
  );

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
    >
      <Button
        variant="ghost"
        size="sm"
        onClick={onBack}
        className="mb-3 text-muted-foreground hover:text-foreground -ml-2"
      >
        <ChevronLeft size={16} />
        Back to Leaderboard
      </Button>

      <div className="flex items-center gap-2 mb-1">
        <MapPin size={16} className="text-primary" />
        <h3 className="font-heading font-bold text-lg text-foreground">{data.lga}</h3>
      </div>
      <div className="flex items-center gap-4 mb-4 text-sm">
        <span className="text-muted-foreground">
          Total: <span className="font-bold text-foreground">{data.pledges.toLocaleString()}</span>
        </span>
        <span className="text-primary font-semibold flex items-center gap-1">
          <TrendingUp size={12} /> {data.growth}
        </span>
      </div>

      <p className="font-heading font-semibold text-xs uppercase tracking-widest text-primary mb-3">
        Wards ({sortedWards.length})
      </p>

      <div className="space-y-2 max-h-[420px] overflow-y-auto pr-1">
        {sortedWards.map((ward, i) => {
          const progress = Math.min(100, (ward.pledges / ward.target) * 100);
          return (
            <motion.div
              key={ward.ward}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04, duration: 0.3 }}
              className="bg-card rounded-xl p-3 shadow-card"
            >
              <div className="flex items-center justify-between mb-1.5">
                <h4 className="font-heading font-semibold text-sm text-foreground">{ward.ward}</h4>
                <span className="font-heading font-bold text-sm text-foreground">{ward.pledges.toLocaleString()}</span>
              </div>
              <div className="w-full bg-muted rounded-full h-1.5">
                <div
                  className="bg-gradient-primary h-1.5 rounded-full transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className="flex justify-between mt-1">
                <span className="text-[10px] text-muted-foreground">{progress.toFixed(0)}% of target</span>
                <span className="text-[10px] text-primary font-semibold flex items-center gap-0.5">
                  <TrendingUp size={8} /> {ward.growth}
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};

const PledgeMapLeaderboardSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const [hoveredLga, setHoveredLga] = useState<string | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const [searchQuery, setSearchQuery] = useState("");
  const [bottomSheetData, setBottomSheetData] = useState<LgaPledgeData | null>(null);
  const [bottomSheetOpen, setBottomSheetOpen] = useState(false);
  const [selectedLga, setSelectedLga] = useState<LgaPledgeData | null>(null);
  const isMobile = useIsMobile();

  const hoveredData = useMemo(() => {
    if (!hoveredLga) return null;
    return lgaPledgeData[hoveredLga] ?? null;
  }, [hoveredLga]);

  const totalPledges = useMemo(
    () => Object.values(lgaPledgeData).reduce((sum, s) => sum + s.pledges, 0),
    []
  );

  const filteredLeaderboard = useMemo(() => {
    if (!searchQuery.trim()) return allLeaderboard;
    const q = searchQuery.toLowerCase();
    return allLeaderboard.filter(
      (entry) =>
        entry.lga.toLowerCase().includes(q) ||
        entry.ward.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  const handleLgaClick = useCallback((lgaName: string) => {
    const data = lgaPledgeData[lgaName] ?? null;
    if (!data) return;
    if (isMobile) {
      setBottomSheetData(data);
      setBottomSheetOpen(true);
    } else {
      setSelectedLga(data);
      setSearchQuery("");
    }
  }, [isMobile]);

  return (
    <section ref={ref} className="py-12 sm:py-16 lg:py-20 bg-background" id="map">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-start">
          {/* Left: Map */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7 }}
          >
            <p className="font-heading font-semibold text-xs sm:text-sm uppercase tracking-widest text-primary mb-2 sm:mb-3">
              Pledge Distribution
            </p>
            <h2 className="font-heading font-bold text-2xl sm:text-3xl lg:text-4xl text-foreground mb-2">
              Pledges Across Kano
            </h2>
            <p className="text-muted-foreground max-w-md mb-4 sm:mb-6 text-xs sm:text-sm">
              Click any LGA to see ward-level pledge breakdown.
            </p>

            <div
              className="relative"
              onMouseLeave={() => !isMobile && setHoveredLga(null)}
            >
              <ComposableMap
                projection="geoMercator"
                projectionConfig={{ scale: 18000, center: [8.5, 11.75] }}
                width={800}
                height={700}
                style={{ width: "100%", height: "auto" }}
              >
                <Geographies geography={GEO_URL}>
                  {({ geographies }) =>
                    geographies.map((geo) => {
                      const lgaName = geo.properties.lga_name || geo.properties.NAME_2 || geo.properties.name || "";
                      const data = lgaPledgeData[lgaName];
                      const pledges = data?.pledges ?? 0;
                      const fillColor = getLgaColorScale(pledges);

                      return (
                        <Geography
                          key={geo.rsmKey}
                          geography={geo}
                          onClick={() => handleLgaClick(lgaName)}
                          onMouseEnter={(e) => {
                            if (isMobile) return;
                            setHoveredLga(lgaName);
                            const rect = (e.target as SVGElement).closest("svg")?.getBoundingClientRect();
                            if (rect) setTooltipPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
                          }}
                          onMouseMove={(e) => {
                            if (isMobile) return;
                            const rect = (e.target as SVGElement).closest("svg")?.getBoundingClientRect();
                            if (rect) setTooltipPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
                          }}
                          onMouseLeave={() => !isMobile && setHoveredLga(null)}
                          style={{
                            default: { fill: fillColor, stroke: "hsl(0, 0%, 100%)", strokeWidth: 0.8, outline: "none", transition: "fill 0.2s ease" },
                            hover: { fill: "hsl(120, 100%, 35%)", stroke: "hsl(0, 0%, 100%)", strokeWidth: 1.5, outline: "none", cursor: "pointer" },
                            pressed: { fill: "hsl(120, 100%, 18%)", stroke: "hsl(0, 0%, 100%)", strokeWidth: 1.5, outline: "none" },
                          }}
                        />
                      );
                    })
                  }
                </Geographies>
              </ComposableMap>

              {/* Desktop Tooltip */}
              {!isMobile && hoveredData && (
                <div
                  className="absolute pointer-events-none z-20 bg-card border border-border rounded-xl shadow-elevated px-4 py-3 min-w-[200px] -translate-x-1/2 -translate-y-full"
                  style={{ left: tooltipPos.x, top: tooltipPos.y - 12 }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin size={14} className="text-primary" />
                    <span className="font-heading font-bold text-foreground text-sm">{hoveredData.lga}</span>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Pledges</span>
                      <span className="font-bold text-foreground">{hoveredData.pledges.toLocaleString()}</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-1.5">
                      <div
                        className="bg-gradient-primary h-1.5 rounded-full transition-all"
                        style={{ width: `${Math.min(100, (hoveredData.pledges / hoveredData.target) * 100)}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Growth</span>
                      <span className="text-primary font-semibold flex items-center gap-1">
                        <TrendingUp size={10} />
                        {hoveredData.growth}
                      </span>
                    </div>
                    <p className="text-[10px] text-muted-foreground mt-1">Click to see wards →</p>
                  </div>
                </div>
              )}
            </div>

            {/* Legend */}
            <div className="mt-3 sm:mt-4 flex flex-wrap items-center gap-2 sm:gap-3">
              {lgaLegendItems.map((item) => (
                <div key={item.label} className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full border border-border" style={{ backgroundColor: item.color }} />
                  <span className="text-[10px] sm:text-xs text-muted-foreground font-medium">{item.label}</span>
                </div>
              ))}
            </div>

            <p className="mt-2 sm:mt-3 text-xs sm:text-sm text-muted-foreground">
              Total pledges across all LGAs:{" "}
              <span className="font-heading font-bold text-primary text-sm sm:text-base">{totalPledges.toLocaleString()}</span>
            </p>
          </motion.div>

          {/* Right: Leaderboard or Ward Drill-Down */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <AnimatePresence mode="wait">
              {selectedLga ? (
                <WardDrillDown
                  key={selectedLga.lga}
                  data={selectedLga}
                  onBack={() => setSelectedLga(null)}
                />
              ) : (
                <motion.div
                  key="leaderboard"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                >
                  <p className="font-heading font-semibold text-xs sm:text-sm uppercase tracking-widest text-primary mb-2 sm:mb-3">
                    Top Supporters
                  </p>
                  <h2 className="font-heading font-bold text-2xl sm:text-3xl lg:text-4xl text-foreground mb-2">
                    LGAs Leaderboard
                  </h2>
                  <p className="text-muted-foreground max-w-md mb-4 sm:mb-6 text-xs sm:text-sm">
                    See which LGAs and wards are leading the charge. Click an LGA on the map for ward details.
                  </p>

                  <div className="relative mb-4">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      placeholder="Search LGA or ward..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-9 h-11 text-sm"
                    />
                  </div>

                  <div className="space-y-2 sm:space-y-3 max-h-[500px] overflow-y-auto pr-1">
                    {filteredLeaderboard.length === 0 && (
                      <p className="text-center text-muted-foreground text-sm py-8">
                        No LGAs match your search.
                      </p>
                    )}
                    {filteredLeaderboard.map((entry, index) => (
                      <motion.div
                        key={entry.lga}
                        initial={{ opacity: 0, x: 20 }}
                        animate={isInView ? { opacity: 1, x: 0 } : {}}
                        transition={{ delay: 0.3 + index * 0.08, duration: 0.5 }}
                        className="flex items-center gap-3 sm:gap-4 bg-card rounded-xl p-3 sm:p-4 shadow-card hover:shadow-elevated transition-all cursor-pointer"
                        onClick={() => {
                          const data = lgaPledgeData[entry.lga];
                          if (data) setSelectedLga(data);
                        }}
                      >
                        <div
                          className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-heading font-bold text-xs sm:text-sm shrink-0 ${
                            rankColors[entry.rank - 1] || "bg-muted text-foreground"
                          }`}
                        >
                          {entry.rank}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <h3 className="font-heading font-bold text-sm sm:text-base text-foreground truncate">{entry.lga}</h3>
                            {entry.rank <= 3 && <entry.icon size={14} className="text-primary shrink-0" />}
                          </div>
                          <p className="text-xs sm:text-sm text-muted-foreground truncate">{entry.ward}</p>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <div className="text-right">
                            <p className="font-heading font-bold text-sm sm:text-lg text-foreground">{entry.pledges.toLocaleString()}</p>
                            <p className="text-[10px] sm:text-xs text-primary font-semibold">{entry.growth}</p>
                          </div>
                          <ChevronRight size={14} className="text-muted-foreground" />
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>

      {/* Mobile Bottom Sheet */}
      <MapBottomSheet
        open={bottomSheetOpen}
        onOpenChange={setBottomSheetOpen}
        data={bottomSheetData}
      />
    </section>
  );
};

export default PledgeMapLeaderboardSection;
