import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Newspaper } from "lucide-react";
import { Button } from "@/components/ui/button";

import galleryRally from "@/assets/gallery-rally.jpg";
import galleryCommunity from "@/assets/gallery-community.jpg";
import galleryYouth from "@/assets/gallery-youth.jpg";
import galleryAgriculture from "@/assets/gallery-agriculture.jpg";
import galleryInfrastructure from "@/assets/gallery-infrastructure.jpg";
import galleryWomen from "@/assets/gallery-women.jpg";

const galleryItems = [
  {
    src: galleryRally,
    title: "Grand Rally in Abuja",
    description: "Over 200,000 supporters gathered in unity at the Eagle Square rally.",
  },
  {
    src: galleryCommunity,
    title: "Community Development",
    description: "Grassroots volunteers building infrastructure across local communities.",
  },
  {
    src: galleryYouth,
    title: "Youth Empowerment Summit",
    description: "Engaging the next generation of Nigerian leaders at the national forum.",
  },
  {
    src: galleryAgriculture,
    title: "Agricultural Revolution",
    description: "Supporting farmers with modern equipment and sustainable practices.",
  },
  {
    src: galleryInfrastructure,
    title: "Infrastructure Development",
    description: "New highways and bridges connecting communities across the nation.",
  },
  {
    src: galleryWomen,
    title: "Women in Leadership",
    description: "Empowering women through leadership programs and political participation.",
  },
];

const newsItems = [
  "🎉 Pledge count surpasses 847,000 — 85% of our goal reached!",
  "📍 Kano State leads with 68,000 pledges — setting the pace for the North!",
  "🤝 Over 12,000 volunteers registered nationwide in the last 30 days",
  "🏆 Lagos crosses 55,000 pledges — massive urban support continues",
  "📢 New campaign offices opened in 15 additional LGAs this month",
  "🗳️ Youth pledge registrations up 40% — the future is engaged!",
  "🌍 Diaspora pledge portal launches — Nigerians abroad join the movement",
  "📊 Weekly growth rate hits 3.2% — strongest momentum yet!",
];

const CampaignGallerySection = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const nextSlide = () => setActiveIndex((prev) => (prev + 1) % galleryItems.length);
  const prevSlide = () => setActiveIndex((prev) => (prev - 1 + galleryItems.length) % galleryItems.length);

  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="font-heading font-black text-3xl sm:text-4xl text-foreground mb-3">
            Campaign <span className="text-gradient-primary">Gallery</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Moments from the movement — see the energy, unity, and progress driving Nigeria forward.
          </p>
        </motion.div>

        {/* Gallery carousel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative max-w-5xl mx-auto mb-16"
        >
          <div className="relative overflow-hidden rounded-2xl shadow-elevated aspect-[16/9]">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIndex}
                initial={{ opacity: 0, x: 60 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -60 }}
                transition={{ duration: 0.4 }}
                className="absolute inset-0"
              >
                <img
                  src={galleryItems[activeIndex].src}
                  alt={galleryItems[activeIndex].title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
                  <h3 className="font-heading font-bold text-xl sm:text-2xl text-white mb-2">
                    {galleryItems[activeIndex].title}
                  </h3>
                  <p className="text-white/80 text-sm sm:text-base max-w-lg">
                    {galleryItems[activeIndex].description}
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Nav arrows */}
            <Button
              size="icon"
              variant="ghost"
              onClick={prevSlide}
              className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white rounded-full backdrop-blur-sm"
            >
              <ChevronLeft size={24} />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              onClick={nextSlide}
              className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white rounded-full backdrop-blur-sm"
            >
              <ChevronRight size={24} />
            </Button>
          </div>

          {/* Dots */}
          <div className="flex justify-center gap-2 mt-4">
            {galleryItems.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveIndex(i)}
                className={`w-2.5 h-2.5 rounded-full transition-all ${
                  i === activeIndex
                    ? "bg-primary w-7"
                    : "bg-border hover:bg-muted-foreground/40"
                }`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>

          {/* Thumbnails */}
          <div className="hidden sm:grid grid-cols-6 gap-2 mt-4">
            {galleryItems.map((item, i) => (
              <button
                key={i}
                onClick={() => setActiveIndex(i)}
                className={`rounded-lg overflow-hidden border-2 transition-all ${
                  i === activeIndex ? "border-primary shadow-primary" : "border-transparent opacity-60 hover:opacity-100"
                }`}
              >
                <img src={item.src} alt={item.title} className="w-full aspect-video object-cover" />
              </button>
            ))}
          </div>
        </motion.div>

        {/* News ticker */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-card border border-border rounded-xl overflow-hidden shadow-card"
        >
          <div className="flex items-center gap-3 px-4 py-3 bg-primary text-primary-foreground">
            <Newspaper size={18} />
            <span className="font-heading font-bold text-sm uppercase tracking-wide">Latest Updates</span>
          </div>
          <div className="relative overflow-hidden py-3">
            <motion.div
              animate={{ x: ["0%", "-100%"] }}
              transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
              className="flex whitespace-nowrap gap-12 px-4"
            >
              {[...newsItems, ...newsItems].map((item, i) => (
                <span key={i} className="text-sm text-foreground font-medium">
                  {item}
                </span>
              ))}
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CampaignGallerySection;
