import { useEffect } from "react";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import { Button } from "@/components/ui/button";
import { CalendarIcon, AlertCircle, InfoIcon } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { NominationProvider, useNomination } from "@/contexts/NominationContext";
import NominationFormWrapper from "@/components/nominations/NominationFormWrapper";
import NotificationBanner from "@/components/common/NotificationBanner";
import EligibilityProcessSection from "@/components/nominations/EligibilityProcessSection";

const NominationsContent = () => {
  const { resetNomination } = useNomination();
  const isNominationOpen = true; 
  
  useEffect(() => {
    resetNomination();
  }, [resetNomination]);

  return (
    <div className="min-h-screen bg-tpahla-dark text-gray-200">
      <NotificationBanner />
      <Navbar />
      
      <div className="pt-32 pb-12 bg-gradient-to-b from-tpahla-dark to-tpahla-darkgreen">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-serif font-bold mb-4 text-tpahla-gold">Nominations</h1>
          <p className="text-xl max-w-3xl mx-auto text-gray-300">
            Submit Your Nominations for The Pan-African Humanitarian Leadership Award 2025
          </p>
        </div>
      </div>
      
      <main className="py-12 md:py-16">
        <section className="container mx-auto px-4 mb-16">
          {isNominationOpen ? (
            <NominationFormWrapper />
          ) : (
            <div className="max-w-3xl mx-auto bg-tpahla-darkgreen/70 p-8 rounded-lg shadow-xl border border-tpahla-gold/30">
              <Alert className="bg-tpahla-purple/20 border-tpahla-purple mb-6 text-tpahla-purple-light">
                <AlertCircle className="h-5 w-5" />
                <AlertTitle className="font-bold">Nominations Closed</AlertTitle>
                <AlertDescription>
                  The nomination period for the 2025 awards is currently not active. It will open in June 2025.
                </AlertDescription>
              </Alert>
              
              <div className="text-center p-8">
                <div className="w-24 h-24 bg-tpahla-neutral-dark rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <CalendarIcon className="h-12 w-12 text-tpahla-purple" />
                </div>
                <h3 className="text-2xl font-bold mb-3 text-tpahla-gold">Nominations Opening Soon</h3>
                <p className="text-gray-400 mb-8 max-w-md mx-auto">
                  We are excited for your participation! Please check back to submit your nominations.
                </p>
                
                <div className="py-6 px-8 bg-tpahla-neutral-dark rounded-lg inline-block shadow-md border border-tpahla-gold/20">
                  <div className="flex items-center justify-center">
                    <CalendarIcon className="h-6 w-6 text-tpahla-green mr-3" />
                    <span className="font-medium text-lg">Nominations Open: <span className="text-tpahla-green font-semibold">June 1, 2025</span></span>
                  </div>
                  <div className="flex items-center justify-center mt-3">
                    <CalendarIcon className="h-6 w-6 text-tpahla-red mr-3" />
                    <span className="font-medium text-lg">Nominations Close: <span className="text-tpahla-red font-semibold">August 15, 2025</span></span>
                  </div>
                </div>
                
                <div className="mt-10">
                  <Button variant="tpahla-secondary" size="lg" className="px-10 py-3">
                    <InfoIcon className="mr-2 h-5 w-5" />
                    Get Notified When Nominations Open
                  </Button>
                </div>
              </div>
              
              <div className="mt-12 border-t border-tpahla-gold/20 pt-8">
                <h4 className="text-xl font-bold mb-4 text-tpahla-gold">Prepare for Nominations</h4>
                <p className="text-gray-400 mb-4">
                  While you wait for nominations to open, you can prepare by:
                </p>
                <ul className="list-disc list-inside pl-5 space-y-2 text-gray-300 marker:text-tpahla-gold">
                  <li>Researching potential nominees' humanitarian contributions</li>
                  <li>Gathering supporting documentation and evidence</li>
                  <li>Reviewing the award categories and eligibility criteria</li>
                  <li>Reaching out to potential referees for your nomination</li>
                </ul>
              </div>
            </div>
          )}
        </section>
        
        <EligibilityProcessSection />
      </main>
      
      <Footer />
    </div>
  );
}

// Wrap NominationsContent with NominationProvider
const Nominations = () => (
  <NominationProvider>
    <NominationsContent />
  </NominationProvider>
);

export default Nominations;
