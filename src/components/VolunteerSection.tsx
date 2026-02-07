import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Megaphone, UserPlus, MapPin, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";

const roles = [
  {
    icon: UserPlus,
    title: "Community Mobilizer",
    description: "Lead grassroots pledge drives in your ward and local government area.",
    spots: 234,
  },
  {
    icon: Megaphone,
    title: "Digital Ambassador",
    description: "Spread the word on social media and help grow the movement online.",
    spots: 567,
  },
  {
    icon: MapPin,
    title: "PU Coordinator",
    description: "Coordinate pledge collection at your polling unit and verify registrations.",
    spots: 128,
  },
  {
    icon: BookOpen,
    title: "Campaign Educator",
    description: "Educate fellow citizens about the platform and campaign goals.",
    spots: 345,
  },
];

const VolunteerSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} className="py-20 bg-background" id="volunteer">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <p className="font-heading font-semibold text-sm uppercase tracking-widest text-primary mb-3">
            Get Involved
          </p>
          <h2 className="font-heading font-bold text-3xl sm:text-4xl text-foreground mb-4">
            Volunteer Opportunities
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Play your part in this historic movement. Choose a role and make an impact today.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {roles.map((role, index) => (
            <motion.div
              key={role.title}
              initial={{ opacity: 0, y: 25 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: index * 0.12, duration: 0.5 }}
              className="group bg-card rounded-xl p-6 shadow-card hover:shadow-elevated transition-all duration-300 hover:-translate-y-1 border border-border/50 flex flex-col"
            >
              <div className="w-14 h-14 rounded-xl bg-muted flex items-center justify-center mb-5 group-hover:bg-gradient-primary transition-colors">
                <role.icon
                  className="text-primary group-hover:text-primary-foreground transition-colors"
                  size={26}
                />
              </div>
              <h3 className="font-heading font-bold text-lg text-foreground mb-2">
                {role.title}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed flex-1 mb-4">
                {role.description}
              </p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-primary font-semibold">
                  {role.spots} spots open
                </span>
                <Button size="sm" variant="outline" className="text-xs font-heading font-semibold hover:bg-primary hover:text-primary-foreground">
                  Join Now
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default VolunteerSection;
