import { useEffect, useState } from "react";
import { useNomination } from "@/contexts/NominationContext";
import NominationStepA from "@/components/nominations/NominationStepA";
import NominationStepB from "@/components/nominations/NominationStepB";
import NominationStepC from "@/components/nominations/NominationStepC";
import NominationStepD from "@/components/nominations/NominationStepD";
import NominationStepE from "@/components/nominations/NominationStepE"; // Import Step E
import { Button } from "@/components/ui/button";
import { CalendarIcon, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

const NominationFormArea = () => {
  const { currentStep, nominationId, resetNomination, nominationData } = useNomination();
  const [isNominationPeriodOpen, setIsNominationPeriodOpen] = useState(true); // Default to true for now

  useEffect(() => {
    // For testing, keep nominations open.
    // Replace with actual date logic for production.
    // const currentDate = new Date();
    // const nominationsOpenDate = new Date("2025-06-01T00:00:00Z"); 
    // const nominationsCloseDate = new Date("2025-08-15T23:59:59Z");
    // const isOpen = currentDate >= nominationsOpenDate && currentDate <= nominationsCloseDate;
    // setIsNominationPeriodOpen(isOpen);
    setIsNominationPeriodOpen(true); 
  }, []);

  const renderStep = () => {
    // NominationStepE will handle its own display logic (form or submitted view)
    // based on nominationData and its internal state.
    switch (currentStep) {
      case 1:
        return <NominationStepA />;
      case 2:
        return <NominationStepB />;
      case 3:
        return <NominationStepC />;
      case 4:
        return <NominationStepD />;
      case 5: 
        return <NominationStepE />;
      default:
        return <NominationStepA />; // Default to Step A if currentStep is unexpected
    }
  };

  // Check if the nomination has been effectively submitted to control display of "Start New Nomination"
  const isEffectivelySubmitted = nominationData.sectionE && nominationData.sectionE.nominator_signature && nominationData.sectionE.confirm_accuracy;

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
          {/* Progress Bar (optional, to be added later based on spec) */}
          {/* <div className="mb-8"> ... </div> */}
          
          {renderStep()}

          {/* This "Start New Nomination" button is for the overall form, 
              NominationStepE handles its own once submitted.
              It should not show if on step 5 AND submitted, or just on step 5 as StepE has back/submit.
              Effectively, it shows if there's an ID, it's not fully submitted yet, AND we are not on the final step.
          */}
          {nominationId && !isEffectivelySubmitted && currentStep !== 5 && (
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

export default NominationFormArea;
