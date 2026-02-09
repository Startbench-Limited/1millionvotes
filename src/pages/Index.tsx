import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import PledgeCounter from "@/components/PledgeCounter";
import FeaturesSection from "@/components/FeaturesSection";
import NigeriaMapSection from "@/components/NigeriaMapSection";
import RegisterSection from "@/components/RegisterSection";
import LeaderboardSection from "@/components/LeaderboardSection";
import CampaignGallerySection from "@/components/CampaignGallerySection";
import VolunteerSection from "@/components/VolunteerSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSection />
        <PledgeCounter />
        <FeaturesSection />
        <NigeriaMapSection />
        <RegisterSection />
        <LeaderboardSection />
        <CampaignGallerySection />
        <VolunteerSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
