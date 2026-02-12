import { useState, useMemo, useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  ComposableMap,
  Geographies,
  Geography,
} from "react-simple-maps";
import { statePledgeData, getColorScale, legendItems } from "@/data/nigeriaPledgeData";
import { MapPin, TrendingUp, Trophy, Medal, Award } from "lucide-react";

const GEO_URL = "/nigeria-states.json";

const leaderboard = [
  { rank: 1, state: "Lagos", ward: "Ikeja Central", pledges: 45892, growth: "+12.4%", icon: Trophy },
  { rank: 2, state: "Kano", ward: "Nassarawa GRA", pledges: 38741, growth: "+9.8%", icon: Medal },
  { rank: 3, state: "Rivers", ward: "Port Harcourt Central", pledges: 32156, growth: "+15.2%", icon: Award },
  { rank: 4, state: "Oyo", ward: "Ibadan North", pledges: 28493, growth: "+7.6%", icon: TrendingUp },
  { rank: 5, state: "Abuja FCT", ward: "Wuse II", pledges: 25187, growth: "+11.3%", icon: TrendingUp },
  { rank: 6, state: "Kaduna", ward: "Kaduna North", pledges: 22341, growth: "+8.1%", icon: TrendingUp },
];

const rankColors = [
  "bg-gradient-primary text-primary-foreground",
  "bg-secondary text-secondary-foreground",
  "bg-alert text-alert-foreground",
];

const PledgeMapLeaderboardSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const [hoveredState, setHoveredState] = useState<string | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

  const hoveredData = useMemo(() => {
    if (!hoveredState) return null;
    return statePledgeData[hoveredState] ?? null;
  }, [hoveredState]);

  const totalPledges = useMemo(
    () => Object.values(statePledgeData).reduce((sum, s) => sum + s.pledges, 0),
    []
  );

  return (
    <section ref={ref} className="py-20 bg-background" id="map">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Left: Map */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7 }}
          >
            <p className="font-heading font-semibold text-sm uppercase tracking-widest text-primary mb-3">
              Pledge Distribution
            </p>
            <h2 className="font-heading font-bold text-3xl sm:text-4xl text-foreground mb-2">
              Pledges Across Nigeria
            </h2>
            <p className="text-muted-foreground max-w-md mb-6 text-sm">
              Explore how pledges are distributed across all 36 states and the FCT.
              Hover over any state to see detailed statistics.
            </p>

            <div
              className="relative"
              onMouseLeave={() => setHoveredState(null)}
            >
              <ComposableMap
                projection="geoMercator"
                projectionConfig={{ scale: 2800, center: [8.5, 9.0] }}
                width={800}
                height={700}
                style={{ width: "100%", height: "auto" }}
              >
                <Geographies geography={GEO_URL}>
                  {({ geographies }) =>
                    geographies.map((geo) => {
                      const stateName = geo.properties.NAME_1 || geo.properties.name || "";
                      const data = statePledgeData[stateName];
                      const pledges = data?.pledges ?? 0;
                      const fillColor = getColorScale(pledges);

                      return (
                        <Geography
                          key={geo.rsmKey}
                          geography={geo}
                          onMouseEnter={(e) => {
                            setHoveredState(stateName);
                            const rect = (e.target as SVGElement).closest("svg")?.getBoundingClientRect();
                            if (rect) setTooltipPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
                          }}
                          onMouseMove={(e) => {
                            const rect = (e.target as SVGElement).closest("svg")?.getBoundingClientRect();
                            if (rect) setTooltipPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
                          }}
                          onMouseLeave={() => setHoveredState(null)}
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

              {/* Tooltip */}
              {hoveredData && (
                <div
                  className="absolute pointer-events-none z-20 bg-card border border-border rounded-xl shadow-elevated px-4 py-3 min-w-[200px] -translate-x-1/2 -translate-y-full"
                  style={{ left: tooltipPos.x, top: tooltipPos.y - 12 }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin size={14} className="text-primary" />
                    <span className="font-heading font-bold text-foreground text-sm">{hoveredData.state}</span>
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
                  </div>
                </div>
              )}
            </div>

            {/* Legend */}
            <div className="mt-4 flex flex-wrap items-center gap-3">
              {legendItems.map((item) => (
                <div key={item.label} className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full border border-border" style={{ backgroundColor: item.color }} />
                  <span className="text-xs text-muted-foreground font-medium">{item.label}</span>
                </div>
              ))}
            </div>

            <p className="mt-3 text-sm text-muted-foreground">
              Total pledges across all states:{" "}
              <span className="font-heading font-bold text-primary text-base">{totalPledges.toLocaleString()}</span>
            </p>
          </motion.div>

          {/* Right: Leaderboard */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <p className="font-heading font-semibold text-sm uppercase tracking-widest text-primary mb-3">
              Top Supporters
            </p>
            <h2 className="font-heading font-bold text-3xl sm:text-4xl text-foreground mb-2">
              State Leaderboard
            </h2>
            <p className="text-muted-foreground max-w-md mb-6 text-sm">
              See which states and wards are leading the charge for 1 million pledges.
            </p>

            <div className="space-y-3">
              {leaderboard.map((entry, index) => (
                <motion.div
                  key={entry.state}
                  initial={{ opacity: 0, x: 20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.3 + index * 0.08, duration: 0.5 }}
                  className="flex items-center gap-4 bg-card rounded-xl p-4 shadow-card hover:shadow-elevated transition-all"
                >
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-heading font-bold text-sm shrink-0 ${
                      rankColors[index] || "bg-muted text-foreground"
                    }`}
                  >
                    {entry.rank}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-heading font-bold text-foreground truncate">{entry.state}</h3>
                      {index < 3 && <entry.icon size={16} className="text-primary shrink-0" />}
                    </div>
                    <p className="text-sm text-muted-foreground truncate">{entry.ward}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="font-heading font-bold text-lg text-foreground">{entry.pledges.toLocaleString()}</p>
                    <p className="text-xs text-primary font-semibold">{entry.growth}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default PledgeMapLeaderboardSection;
