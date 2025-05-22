import { useEffect, useState } from "react";
import { NominationProvider, useNomination } from "@/contexts/NominationContext";
import NominationStepA from "@/components/nominations/NominationStepA";
import { Button } from "@/components/ui/button";
import { CalendarIcon, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

const EligibilityProcessSection = () => (
  <div className="max-w-4xl mx-auto text-gray-700 dark:text-gray-300">
    <h2 className="text-3xl font-serif font-bold mb-6 text-tpahla-darkgreen dark:text-tpahla-gold text-center">Nomination Process</h2>
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 mb-12">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
        <div className="space-y-4">
          <div className="w-16 h-16 bg-tpahla-darkgreen dark:bg-tpahla-gold rounded-full flex items-center justify-center text-white dark:text-tpahla-darkgreen text-2xl font-bold mx-auto">1</div>
          <h3 className="text-lg font-bold">Submit Nomination</h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm">Complete the nomination form with all required information about the nominee.</p>
        </div>
        <div className="space-y-4">
          <div className="w-16 h-16 bg-tpahla-darkgreen dark:bg-tpahla-gold rounded-full flex items-center justify-center text-white dark:text-tpahla-darkgreen text-2xl font-bold mx-auto">2</div>
          <h3 className="text-lg font-bold">Evaluation</h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm">Our panel of judges reviews all nominations based on the established criteria.</p>
        </div>
        <div className="space-y-4">
          <div className="w-16 h-16 bg-tpahla-darkgreen dark:bg-tpahla-gold rounded-full flex items-center justify-center text-white dark:text-tpahla-darkgreen text-2xl font-bold mx-auto">3</div>
          <h3 className="text-lg font-bold">Selection</h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm">Finalists are selected and winners are chosen in each category.</p>
        </div>
      </div>
      
      <div className="mt-10 p-4 bg-yellow-50 dark:bg-yellow-400/10 border-l-4 border-tpahla-gold rounded">
        <p className="font-medium text-tpahla-darkgreen dark:text-tpahla-gold">Nominations Deadline: August 15, 2025</p>
        <p className="text-sm text-gray-600 dark:text-gray-400">All nominations must be submitted by this date to be considered for the 2025 awards.</p>
      </div>
    </div>
    
    <h2 className="text-3xl font-serif font-bold mb-6 text-tpahla-darkgreen dark:text-tpahla-gold text-center">Eligibility Criteria</h2>
    
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 mb-12">
      <ul className="space-y-4">
        <li className="flex items-start">
          <svg className="h-6 w-6 text-tpahla-gold flex-shrink-0 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
          <span className="text-gray-700 dark:text-gray-300">Nominees must be individuals, organizations, or institutions that have made significant contributions to humanitarian service in Africa.</span>
        </li>
        <li className="flex items-start">
          <svg className="h-6 w-6 text-tpahla-gold flex-shrink-0 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
          <span className="text-gray-700 dark:text-gray-300">Contributions must have been made within the past five years (2020-2025).</span>
        </li>
        <li className="flex items-start">
          <svg className="h-6 w-6 text-tpahla-gold flex-shrink-0 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
          <span className="text-gray-700 dark:text-gray-300">Nominees must demonstrate tangible impact and results from their humanitarian efforts.</span>
        </li>
        <li className="flex items-start">
          <svg className="h-6 w-6 text-tpahla-gold flex-shrink-0 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
          <span className="text-gray-700 dark:text-gray-300">Self-nominations are accepted, but must include references from at least two independent sources.</span>
        </li>
        <li className="flex items-start">
          <svg className="h-6 w-6 text-tpahla-gold flex-shrink-0 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
          <span className="text-gray-700 dark:text-gray-300">All required documentation must be submitted along with the nomination form.</span>
        </li>
      </ul>
    </div>
  </div>
);

const NominationFormArea = () => {
  const { currentStep, nominationId, resetNomination } = useNomination();
  const [isNominationPeriodOpen, setIsNominationPeriodOpen] = useState(false);

  useEffect(() => {
    const currentDate = new Date();
    // Note: Current date is 2025-05-22 as per system settings.
    // Nominations open June 1, 2025 and close August 15, 2025.
    // So, isNominationPeriodOpen should be false.
    const nominationsOpenDate = new Date("2025-06-01T00:00:00Z"); 
    const nominationsCloseDate = new Date("2025-08-15T23:59:59Z");
    
    // console.log("Current Date:", currentDate.toISOString());
    // console.log("Nominations Open:", nominationsOpenDate.toISOString());
    // console.log("Nominations Close:", nominationsCloseDate.toISOString());
    
    const isOpen = currentDate >= nominationsOpenDate && currentDate <= nominationsCloseDate;
    // console.log("Is Nomination Period Open?", isOpen);
    setIsNominationPeriodOpen(isOpen);
  }, []);

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <NominationStepA />;
      default:
        return <NominationStepA />;
    }
  };

  return (
    <div className="bg-gray-900 rounded-lg shadow-xl p-6 md:p-10">
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-serif font-bold text-tpahla-gold">
          TPAHLA 2025 NOMINATION FORM
        </h1>
        <p className="text-lg text-gray-300">
          Honoring Heroes, Forging Forward.
        </p>
      </div>

      {isNominationPeriodOpen ? (
        <>
          {/* Progress Bar (optional) */}
          {/* <div className="mb-8"> ... </div> */}
          {renderStep()}
          {nominationId && (
            <div className="mt-8 text-center">
              <Button variant="link" onClick={resetNomination} className="text-tpahla-gold hover:text-yellow-400">
                Start New Nomination
              </Button>
              <p className="text-xs text-gray-500 mt-1">Nomination ID: {nominationId}</p>
            </div>
          )}
        </>
      ) : (
        <div className="bg-gray-800 rounded-lg shadow-md p-8 text-gray-100">
            <Alert className="bg-tpahla-purple/20 border-tpahla-purple mb-6">
              <AlertCircle className="h-4 w-4 text-tpahla-purple" />
              <AlertDescription>
                <span className="font-medium">Nominations are currently closed.</span>
                The nomination period is from June 1, 2025, to August 15, 2025.
              </AlertDescription>
            </Alert>
            
            <div className="text-center p-8">
              <div className="w-20 h-20 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <CalendarIcon className="h-10 w-10 text-tpahla-purple" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-tpahla-gold">Nominations Currently Closed</h3>
              <p className="text-gray-400 mb-6">
                Please check back between June 1, 2025, and August 15, 2025, to submit your nominations.
              </p>
              
              <div className="py-4 px-6 bg-gray-700 rounded-lg inline-block">
                <div className="flex items-center">
                  <CalendarIcon className="h-5 w-5 text-tpahla-gold mr-2" />
                  <span className="font-medium">Nominations Open: <span className="text-tpahla-gold">June 1, 2025</span></span>
                </div>
                <div className="flex items-center mt-2">
                  <CalendarIcon className="h-5 w-5 text-tpahla-gold mr-2" />
                  <span className="font-medium">Nominations Close: <span className="text-tpahla-gold">August 15, 2025</span></span>
                </div>
              </div>
              
              <div className="mt-8">
                <Button variant="tpahla-secondary" className="px-8">
                  Get Notified When Nominations Open
                </Button>
              </div>
            </div>
        </div>
      )}
       <div className="mt-12 text-center text-gray-400 text-sm">
            <p className="font-semibold">SUBMISSION DETAILS</p>
            <p>Submit the completed form and supporting documents to: <a href="mailto:tpahla@ihsd-ng.org" className="text-tpahla-gold hover:underline">tpahla@ihsd-ng.org</a></p>
            <p>Visit <a href="https://ihsd-ng.org/TPAHLA" target="_blank" rel="noopener noreferrer" className="text-tpahla-gold hover:underline">https://ihsd-ng.org/TPAHLA</a> for more information and full award guidelines.</p>
            <p>For inquiries: +234-802-368 6143, +234-806-039 6906</p>
            <p className="mt-4 font-semibold">#TPAHLA2025 | #AfricanHumanitarianHeroes | #HonoringHeroes | #ForgingForward</p>
        </div>
    </div>
  );
};

const Nominations = () => {
  return (
    <NominationProvider> 
      {/* Page Header */}
      <div className="pt-24 pb-12 bg-tpahla-darkgreen text-white">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-serif font-bold mb-4">Nominations</h1>
          <p className="text-lg max-w-3xl mx-auto">
            Submit Your Nominations for The Pan-African Humanitarian Leadership Award
          </p>
        </div>
      </div>
      
      <main className="py-12 bg-background dark:bg-gray-900">
        <section className="container mx-auto px-4 mb-16">
          <EligibilityProcessSection />
        </section>

        <section className="container mx-auto px-4 mb-16">
          <NominationFormArea />
        </section>
      </main>
    </NominationProvider>
  );
};

export default Nominations;
