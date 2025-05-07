
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import HeroSection from "../components/home/HeroSection";
import CountdownTimer from "../components/home/CountdownTimer";
import AboutSection from "../components/home/AboutSection";
import AwardsSection from "../components/home/AwardsSection";
import NominationSection from "../components/home/NominationSection";
import EventSection from "../components/home/EventSection";
import SponsorSection from "../components/home/SponsorSection";
import RegistrationSection from "../components/home/RegistrationSection";
import ContactSection from "../components/home/ContactSection";

const Index = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <main>
        <HeroSection />
        <CountdownTimer />
        <AboutSection />
        <AwardsSection />
        <NominationSection />
        <EventSection />
        <SponsorSection />
        <RegistrationSection />
        <ContactSection />
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
