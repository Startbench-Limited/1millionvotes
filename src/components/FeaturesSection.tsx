import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Shield, BarChart3, MapPin, Share2, Bell, Fingerprint } from "lucide-react";

const features = [
  {
    icon: Fingerprint,
    title: "Secure Registration",
    description: "Register with your PVC and polling unit details. Your data is encrypted and protected.",
  },
  {
    icon: MapPin,
    title: "PU-Level Tracking",
    description: "Track pledges down to each polling unit across all 36 states and the FCT.",
  },
  {
    icon: BarChart3,
    title: "Live Analytics",
    description: "Real-time dashboards showing pledge distribution, trends, and campaign milestones.",
  },
  {
    icon: Shield,
    title: "Verified Pledges",
    description: "Every pledge is verified to ensure authenticity and prevent duplicate entries.",
  },
  {
    icon: Share2,
    title: "Social Sharing",
    description: "Amplify the movement by sharing your pledge on social media platforms.",
  },
  {
    icon: Bell,
    title: "Campaign Updates",
    description: "Stay informed with real-time notifications about campaign progress and events.",
  },
];

const FeaturesSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} className="py-20 bg-background" id="analytics">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="font-heading font-semibold text-sm uppercase tracking-widest text-primary mb-3">
            Platform Features
          </p>
          <h2 className="font-heading font-bold text-3xl sm:text-4xl text-foreground mb-4">
            Built for Transparency & Trust
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Our platform ensures every pledge is counted, verified, and visible — empowering grassroots democracy.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 25 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="group bg-card rounded-xl p-8 shadow-card hover:shadow-elevated transition-all duration-300 hover:-translate-y-1 border border-border/50"
            >
              <div className="w-12 h-12 rounded-lg bg-gradient-primary flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <feature.icon className="text-primary-foreground" size={24} />
              </div>
              <h3 className="font-heading font-bold text-lg text-foreground mb-2">
                {feature.title}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
