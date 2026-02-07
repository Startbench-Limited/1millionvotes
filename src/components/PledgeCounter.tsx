import { useEffect, useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Target, TrendingUp, MapPin, Users } from "lucide-react";

const useCountUp = (end: number, duration: number = 2000, startCounting: boolean = true) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!startCounting) return;
    let startTime: number;
    let animationFrame: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * end));
      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [end, duration, startCounting]);

  return count;
};

const stats = [
  { icon: Target, label: "Total Pledges", value: 847329, suffix: "", color: "text-primary" },
  { icon: TrendingUp, label: "Today's Pledges", value: 12847, suffix: "", color: "text-accent" },
  { icon: MapPin, label: "Polling Units", value: 17692, suffix: "", color: "text-primary" },
  { icon: Users, label: "Volunteers", value: 34521, suffix: "", color: "text-accent" },
];

const PledgeCounter = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const pledgeCount = useCountUp(847329, 2500, isInView);
  const goal = 1000000;
  const progressPercent = Math.round((pledgeCount / goal) * 100);

  return (
    <section ref={ref} className="py-20 bg-muted" id="track">
      <div className="container mx-auto px-4">
        {/* Main counter */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-12"
        >
          <p className="font-heading font-semibold text-sm uppercase tracking-widest text-primary mb-4">
            Live Pledge Counter
          </p>
          <div className="font-heading font-black text-6xl sm:text-7xl md:text-8xl text-primary counter-glow mb-4">
            {pledgeCount.toLocaleString()}
          </div>
          <p className="text-muted-foreground text-lg font-body">
            out of <span className="font-bold text-foreground">1,000,000</span> goal
          </p>
        </motion.div>

        {/* Progress bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="max-w-3xl mx-auto mb-16"
        >
          <div className="flex justify-between mb-2 text-sm font-medium">
            <span className="text-muted-foreground">Progress</span>
            <span className="text-primary font-heading font-bold">{progressPercent}%</span>
          </div>
          <div className="h-4 bg-border rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={isInView ? { width: `${progressPercent}%` } : {}}
              transition={{ delay: 0.6, duration: 2, ease: "easeOut" }}
              className="h-full bg-gradient-primary rounded-full animate-pulse-glow"
            />
          </div>
          <div className="flex justify-between mt-2 text-xs text-muted-foreground">
            <span>0</span>
            <span>250K</span>
            <span>500K</span>
            <span>750K</span>
            <span>1M</span>
          </div>
        </motion.div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {stats.map((stat, index) => (
            <StatCard key={stat.label} stat={stat} index={index} isInView={isInView} />
          ))}
        </div>
      </div>
    </section>
  );
};

const StatCard = ({
  stat,
  index,
  isInView,
}: {
  stat: (typeof stats)[0];
  index: number;
  isInView: boolean;
}) => {
  const count = useCountUp(stat.value, 2000 + index * 300, isInView);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: 0.3 + index * 0.15, duration: 0.5 }}
      className="bg-card rounded-xl p-6 shadow-card text-center hover:shadow-elevated transition-shadow"
    >
      <stat.icon className={`mx-auto mb-3 ${stat.color}`} size={28} />
      <div className="font-heading font-bold text-2xl sm:text-3xl text-foreground mb-1">
        {count.toLocaleString()}{stat.suffix}
      </div>
      <p className="text-sm text-muted-foreground font-medium">{stat.label}</p>
    </motion.div>
  );
};

export default PledgeCounter;
