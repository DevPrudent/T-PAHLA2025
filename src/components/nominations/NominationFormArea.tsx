import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useNomination } from "@/contexts/NominationContext";
import NominationStepA from "@/components/nominations/NominationStepA";
import NominationStepB from "@/components/nominations/NominationStepB";
import NominationStepC from "@/components/nominations/NominationStepC";
import NominationStepD from "@/components/nominations/NominationStepD";
import NominationStepE from "@/components/nominations/NominationStepE"; // Import Step E
import { Button } from "@/components/ui/button";
import { CalendarIcon, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const NominationFormArea = () => {
  const [searchParams] = useSearchParams();
  const continueNominationId = searchParams.get('continue');
  const { currentStep, nominationId, resetNomination, nominationData } = useNomination();
  const [isNominationPeriodOpen, setIsNominationPeriodOpen] = useState(true); // Default to true for now
  const [isLoadingContinuation, setIsLoadingContinuation] = useState(false);

  useEffect(() => {
    // Check if current date is within nomination period
    const currentDate = new Date();
    const nominationsOpenDate = new Date("2025-06-20T00:00:00Z"); 
    const nominationsCloseDate = new Date("2025-08-15T23:59:59Z");
    const isOpen = currentDate >= nominationsOpenDate && currentDate <= nominationsCloseDate;
    setIsNominationPeriodOpen(isOpen);
  }, []);

  // Handle continuation from email link
  useEffect(() => {
    const loadExistingNomination = async () => {
      if (!continueNominationId || nominationId) return; // Don't load if already have a nomination
      
      setIsLoadingContinuation(true);
      try {
        const { data: nomination, error } = await supabase
          .from('nominations')
          .select('*')
          .eq('id', continueNominationId)
          .in('status', ['draft', 'incomplete'])
          .single();

        if (error) {
          console.error('Error loading nomination:', error);
          toast.error('Could not load your nomination. Please start a new one.');
          return;
        }

        if (nomination) {
          // Load the nomination data into context
          const { setNominationId, updateSectionData, setCurrentStep } = useNomination();
          setNominationId(nomination.id);
          
          // Load existing form data
          if (nomination.form_section_a) {
            updateSectionData('sectionA', nomination.form_section_a);
          }
          if (nomination.form_section_b) {
            updateSectionData('sectionB', nomination.form_section_b);
          }
          if (nomination.form_section_c) {
            updateSectionData('sectionC', nomination.form_section_c);
          }
          if (nomination.form_section_d) {
            updateSectionData('sectionD', nomination.form_section_d);
          }
          if (nomination.form_section_e) {
            updateSectionData('sectionE', nomination.form_section_e);
          }

          // Determine which step to start from based on completed sections
          let nextStep = 1;
          if (nomination.form_section_a) nextStep = 2;
          if (nomination.form_section_b) nextStep = 3;
          if (nomination.form_section_c) nextStep = 4;
          if (nomination.form_section_d) nextStep = 5;
          
          setCurrentStep(nextStep);
          
          toast.success(`Welcome back! Continuing your nomination for ${nomination.nominee_name}`, {
            description: `Nomination ID: ${nomination.id}`,
            duration: 5000,
          });
        }
      } catch (error) {
        console.error('Error loading existing nomination:', error);
        toast.error('Could not load your nomination. Please start a new one.');
      } finally {
        setIsLoadingContinuation(false);
      }
    };

    loadExistingNomination();
  }, [continueNominationId, nominationId]);

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

  if (isLoadingContinuation) {
    return (
      <div className="bg-gray-900 rounded-lg shadow-xl p-6 md:p-10">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-tpahla-gold/20 rounded-full mb-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-tpahla-gold"></div>
          </div>
          <h3 className="text-xl font-bold text-tpahla-gold mb-2">Loading Your Nomination</h3>
          <p className="text-gray-300">
            We're retrieving your saved nomination data...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 rounded-lg shadow-xl p-6 md:p-10">
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-serif font-bold text-tpahla-gold">
          TPAHLA 2025 NOMINATION FORM
        </h1>
        <p className="text-lg text-gray-300">
          Honoring Heroes, Forging Forward.
        </p>
        {continueNominationId && (
          <div className="mt-4 p-3 bg-tpahla-gold/10 rounded-lg border border-tpahla-gold/30">
            <p className="text-sm text-tpahla-gold">
              📧 Continuing from email link - Nomination ID: {continueNominationId}
            </p>
          </div>
        )}
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
              <Button variant="link\" onClick={resetNomination} className="text-tpahla-gold hover:text-yellow-400">
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
                The nomination period is from June 20, 2025, to August 15, 2025.
              </AlertDescription>
            </Alert>
            
            <div className="text-center p-8">
              <div className="w-20 h-20 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <CalendarIcon className="h-10 w-10 text-tpahla-purple" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-tpahla-gold">Nominations Currently Closed</h3>
              <p className="text-gray-400 mb-6">
                Please check back between June 20, 2025, and August 15, 2025, to submit your nominations.
              </p>
              
              <div className="py-4 px-6 bg-gray-700 rounded-lg inline-block">
                <div className="flex items-center">
                  <CalendarIcon className="h-5 w-5 text-tpahla-gold mr-2" />
                  <span className="font-medium">Nominations Open: <span className="text-tpahla-gold">June 20, 2025</span></span>
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
            <p>Submit the completed form and supporting documents to: <a href="mailto:2025@tpahla.africa" className="text-tpahla-gold hover:underline">2025@tpahla.africa</a></p>
            <p>Visit <a href="https://ihsd-ng.org/TPAHLA" target="_blank" rel="noopener noreferrer" className="text-tpahla-gold hover:underline">https://ihsd-ng.org/TPAHLA</a> for more information and full award guidelines.</p>
            <p>For inquiries: <a href="https://wa.me/2348104906878" target="_blank" rel="noopener noreferrer" className="text-tpahla-gold hover:underline font-bold">+234-810-490-6878 (WhatsApp)</a>, +234-802-368-6143, +234-706-751-9128, +234-806-039-6906</p>
            <p className="mt-4 font-semibold">#TPAHLA2025 | #AfricanHumanitarianHeroes | #HonoringHeroes | #ForgingForward</p>
        </div>
    </div>
  );
};

export default NominationFormArea;