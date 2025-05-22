
import { useEffect } from "react";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import { Button } from "@/components/ui/button";
import { CalendarIcon, AlertCircle, InfoIcon } from "lucide-react"; // Added InfoIcon
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"; // Added AlertTitle
import { NominationProvider, useNomination } from "@/contexts/NominationContext";
import NominationFormWrapper from "@/components/nominations/NominationFormWrapper";
import NotificationBanner from "@/components/common/NotificationBanner"; // Assuming this is desired on all pages

const NominationsContent = () => {
  const { resetNomination } = useNomination(); // Get reset function
  // const [isNominationOpen, setIsNominationOpen] = useState(false); // Kept for future use if needed for overall open/close

  // For now, assuming nominations are always "open" for the form to be active.
  // The June 1st logic can be for a global switch later.
  const isNominationOpen = true; 
  
  useEffect(() => {
    // Reset form when component mounts or nominationId changes to null externally
    resetNomination();
  }, [resetNomination]);


  return (
    <div className="min-h-screen bg-tpahla-dark text-gray-200"> {/* Dark theme base */}
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
            // This part is kept for when nominations are truly closed based on date
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
        
        {/* Eligibility Criteria and Process Overview - Can be styled with dark theme */}
        <section className="container mx-auto px-4 mb-16">
          <div className="max-w-4xl mx-auto bg-tpahla-darkgreen/70 p-8 md:p-10 rounded-xl shadow-xl border border-tpahla-gold/30">
            <h2 className="text-3xl font-serif font-bold mb-8 text-tpahla-gold text-center">Eligibility & Process</h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold mb-4 text-tpahla-gold-light">Eligibility Criteria</h3>
                <ul className="space-y-3 text-gray-300">
                  {[
                    "Nominees must be individuals, organizations, or institutions that have made significant contributions to humanitarian service in Africa.",
                    "Contributions must have been made within the past five years (2020-2025).",
                    "Nominees must demonstrate tangible impact and results from their humanitarian efforts.",
                    "Self-nominations are accepted, but must include references from at least two independent sources.",
                    "All required documentation must be submitted along with the nomination form."
                  ].map((item, index) => (
                    <li key={index} className="flex items-start">
                      <svg className="h-5 w-5 text-tpahla-gold flex-shrink-0 mr-2 mt-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-4 text-tpahla-gold-light">Nomination Process Overview</h3>
                 <div className="space-y-4">
                    {[
                      {step: 1, title: "Submit Nomination", desc: "Complete the multi-step nomination form with all required information."},
                      {step: 2, title: "Evaluation", desc: "Our panel of judges reviews all nominations based on the established criteria."},
                      {step: 3, title: "Selection", desc: "Finalists are selected and winners are chosen in each category."}
                    ].map(item => (
                      <div key={item.step} className="flex items-start">
                        <div className="w-8 h-8 bg-tpahla-gold rounded-full flex items-center justify-center text-tpahla-darkgreen font-bold text-sm mr-3 flex-shrink-0">{item.step}</div>
                        <div>
                          <h4 className="font-semibold text-gray-200">{item.title}</h4>
                          <p className="text-sm text-gray-400">{item.desc}</p>
                        </div>
                      </div>
                    ))}
                 </div>
                 <div className="mt-6 p-4 bg-tpahla-purple/20 border-l-4 border-tpahla-purple rounded">
                    <p className="font-medium text-tpahla-purple-light">Nominations Deadline: <span className="font-bold">August 15, 2025</span></p>
                    <p className="text-sm text-gray-400">All nominations must be submitted by this date to be considered.</p>
                 </div>
              </div>
            </div>
          </div>
        </section>
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

