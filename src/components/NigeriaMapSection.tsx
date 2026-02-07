import { useState, useMemo, useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  ComposableMap,
  Geographies,
  Geography,
} from "react-simple-maps";
import { statePledgeData, getColorScale, legendItems } from "@/data/nigeriaPledgeData";
import { MapPin, TrendingUp } from "lucide-react";

const GEO_URL = "/nigeria-states.json";

const NigeriaMapSection = () => {
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
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <p className="font-heading font-semibold text-sm uppercase tracking-widest text-primary mb-3">
            Pledge Distribution
          </p>
          <h2 className="font-heading font-bold text-3xl sm:text-4xl text-foreground mb-4">
            Pledges Across Nigeria
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Explore how pledges are distributed across all 36 states and the FCT.
            Hover over any state to see detailed statistics.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="max-w-4xl mx-auto"
        >
          <div className="bg-card rounded-2xl shadow-card p-4 sm:p-8 relative">
            {/* Map */}
            <div
              className="relative"
              onMouseLeave={() => setHoveredState(null)}
            >
              <ComposableMap
                projection="geoMercator"
                projectionConfig={{
                  scale: 2800,
                  center: [8.5, 9.0],
                }}
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
                      const isHovered = hoveredState === stateName;

                      return (
                        <Geography
                          key={geo.rsmKey}
                          geography={geo}
                          onMouseEnter={(e) => {
                            setHoveredState(stateName);
                            const rect = (e.target as SVGElement).closest("svg")?.getBoundingClientRect();
                            if (rect) {
                              setTooltipPos({
                                x: e.clientX - rect.left,
                                y: e.clientY - rect.top,
                              });
                            }
                          }}
                          onMouseMove={(e) => {
                            const rect = (e.target as SVGElement).closest("svg")?.getBoundingClientRect();
                            if (rect) {
                              setTooltipPos({
                                x: e.clientX - rect.left,
                                y: e.clientY - rect.top,
                              });
                            }
                          }}
                          onMouseLeave={() => setHoveredState(null)}
                          style={{
                            default: {
                              fill: fillColor,
                              stroke: "hsl(0, 0%, 100%)",
                              strokeWidth: 0.8,
                              outline: "none",
                              transition: "fill 0.2s ease",
                            },
                            hover: {
                              fill: "hsl(120, 100%, 35%)",
                              stroke: "hsl(0, 0%, 100%)",
                              strokeWidth: 1.5,
                              outline: "none",
                              cursor: "pointer",
                            },
                            pressed: {
                              fill: "hsl(120, 100%, 18%)",
                              stroke: "hsl(0, 0%, 100%)",
                              strokeWidth: 1.5,
                              outline: "none",
                            },
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
                  style={{
                    left: tooltipPos.x,
                    top: tooltipPos.y - 12,
                  }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin size={14} className="text-primary" />
                    <span className="font-heading font-bold text-foreground text-sm">
                      {hoveredData.state}
                    </span>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Pledges</span>
                      <span className="font-bold text-foreground">
                        {hoveredData.pledges.toLocaleString()}
                      </span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-1.5">
                      <div
                        className="bg-gradient-primary h-1.5 rounded-full transition-all"
                        style={{
                          width: `${Math.min(100, (hoveredData.pledges / hoveredData.target) * 100)}%`,
                        }}
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
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3 sm:gap-5">
              {legendItems.map((item) => (
                <div key={item.label} className="flex items-center gap-1.5">
                  <div
                    className="w-3.5 h-3.5 rounded-sm border border-border"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-xs text-muted-foreground font-medium">
                    {item.label}
                  </span>
                </div>
              ))}
            </div>

            {/* Summary stat */}
            <div className="mt-4 text-center">
              <p className="text-sm text-muted-foreground">
                Total pledges across all states:{" "}
                <span className="font-heading font-bold text-primary text-base">
                  {totalPledges.toLocaleString()}
                </span>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default NigeriaMapSection;
