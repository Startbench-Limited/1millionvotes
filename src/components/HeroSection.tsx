import { motion } from "framer-motion";
import { ArrowRight, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import SocialShareButtons from "@/components/SocialShareButtons";
import heroBg from "@/assets/hero-bg.jpg";
import candidatesImg from "@/assets/candidates.png";

const HeroSection = () => {
  return (
    <section
      id="home"
      className="relative min-h-[90vh] flex items-center justify-center overflow-hidden"
    >
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${heroBg})` }}
      />
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-gradient-hero opacity-80" />

      {/* Left candidates - anchored bottom-left, full opacity */}
      <motion.div
        initial={{ opacity: 0, x: -60 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.9, delay: 0.3 }}
        className="absolute left-[-2%] bottom-0 z-10 hidden sm:block pointer-events-none"
        style={{ width: "clamp(260px, 30vw, 500px)" }}
      >
        <img
          src={candidatesImg}
          alt="Tinubu and Abba candidates"
          className="w-full h-auto object-contain"
          style={{ clipPath: "inset(0 52% 0 0)" }}
        />
      </motion.div>

      {/* Right candidates - anchored mid-right, faded */}
      <motion.div
        initial={{ opacity: 0, x: 60 }}
        animate={{ opacity: 0.45, x: 0 }}
        transition={{ duration: 0.9, delay: 0.4 }}
        className="absolute right-[-2%] top-[10%] z-10 hidden md:block pointer-events-none"
        style={{ width: "clamp(220px, 26vw, 440px)" }}
      >
        <img
          src={candidatesImg}
          alt=""
          className="w-full h-auto object-contain"
          style={{ clipPath: "inset(0 0 0 50%)" }}
        />
      </motion.div>

      {/* Bottom-right pledge text overlay */}
      <motion.div
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 0.25, x: 0 }}
        transition={{ duration: 0.8, delay: 0.6 }}
        className="absolute bottom-8 right-4 sm:right-8 z-10 pointer-events-none hidden md:block"
      >
        <p className="font-heading text-primary-foreground italic leading-tight text-right">
          <span className="text-xl lg:text-2xl block">TINUBU & ABBA 1-MILLION</span>
          <span className="text-5xl lg:text-7xl font-black block" style={{ fontFamily: "'Dancing Script', cursive" }}>
            Pledge
          </span>
          <span className="text-5xl lg:text-7xl font-black text-secondary">2027</span>
        </p>
      </motion.div>

      {/* Content */}
      <div className="relative z-20 container mx-auto px-4 py-32 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl mx-auto"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-foreground/10 backdrop-blur-sm border border-primary-foreground/20 mb-8"
          >
            <Users size={16} className="text-secondary" />
            <span className="text-sm font-medium text-primary-foreground">
              Join 847,329 Nigerians who already pledged
            </span>
          </motion.div>

          <h1 className="font-heading font-black text-4xl sm:text-5xl md:text-7xl text-primary-foreground leading-tight mb-2">
            1 Million Pledge
          </h1>
          <h2 className="font-heading font-black text-3xl sm:text-4xl md:text-6xl text-secondary leading-tight mb-6">
            For Tinubu & Abba
          </h2>

          <p className="text-lg sm:text-xl text-primary-foreground/80 max-w-2xl mx-auto mb-10 font-body leading-relaxed">
            Stand with millions of Nigerians in a historic show of grassroots support.
            Register your pledge today and be part of the movement shaping our nation's future.
          </p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Button
              size="lg"
              className="bg-primary-foreground text-accent font-heading font-bold text-lg px-8 py-6 hover:bg-primary-foreground/90 shadow-elevated transition-all hover:scale-105"
            >
              Register Your Pledge
              <ArrowRight className="ml-2" size={20} />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-primary-foreground/30 text-primary-foreground font-heading font-semibold text-lg px-8 py-6 hover:bg-primary-foreground/10 backdrop-blur-sm"
            >
              Track Progress
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.5 }}
            className="mt-8 flex justify-center"
          >
            <SocialShareButtons variant="compact" />
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <div className="w-6 h-10 rounded-full border-2 border-primary-foreground/30 flex items-start justify-center p-1">
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-1.5 h-1.5 rounded-full bg-primary-foreground/60"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
