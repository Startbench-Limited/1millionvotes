import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import PledgeCounter from "@/components/PledgeCounter";
import FeaturesSection from "@/components/FeaturesSection";
import RegisterSection from "@/components/RegisterSection";
import LeaderboardSection from "@/components/LeaderboardSection";
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
        <RegisterSection />
        <LeaderboardSection />
        <VolunteerSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
