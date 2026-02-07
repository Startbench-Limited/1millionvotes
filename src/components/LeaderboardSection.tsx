import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Trophy, Medal, Award, TrendingUp } from "lucide-react";

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

const LeaderboardSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} className="py-20 bg-muted" id="leaderboard">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <p className="font-heading font-semibold text-sm uppercase tracking-widest text-primary mb-3">
            Top Supporters
          </p>
          <h2 className="font-heading font-bold text-3xl sm:text-4xl text-foreground mb-4">
            State Leaderboard
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            See which states and wards are leading the charge for 1 million pledges.
          </p>
        </motion.div>

        <div className="max-w-3xl mx-auto space-y-3">
          {leaderboard.map((entry, index) => (
            <motion.div
              key={entry.state}
              initial={{ opacity: 0, x: -30 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="flex items-center gap-4 bg-card rounded-xl p-4 sm:p-5 shadow-card hover:shadow-elevated transition-all group"
            >
              {/* Rank */}
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-heading font-bold text-sm shrink-0 ${
                  rankColors[index] || "bg-muted text-foreground"
                }`}
              >
                {entry.rank}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-heading font-bold text-foreground truncate">
                    {entry.state}
                  </h3>
                  {index < 3 && (
                    <entry.icon size={16} className="text-primary shrink-0" />
                  )}
                </div>
                <p className="text-sm text-muted-foreground truncate">{entry.ward}</p>
              </div>

              {/* Pledges */}
              <div className="text-right shrink-0">
                <p className="font-heading font-bold text-lg text-foreground">
                  {entry.pledges.toLocaleString()}
                </p>
                <p className="text-xs text-primary font-semibold">{entry.growth}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LeaderboardSection;
