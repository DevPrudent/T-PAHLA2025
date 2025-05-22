
import React from 'react';
import { useNomination } from '@/contexts/NominationContext';
import NominationStepA from './NominationStepA';
import NominationStepB from './NominationStepB';
// import NominationStepC from './NominationStepC'; // Will add later
// import NominationStepD from './NominationStepD'; // Will add later
// import NominationStepE from './NominationStepE'; // Will add later

const NominationFormWrapper = () => {
  const { currentStep } = useNomination();

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <NominationStepA />;
      case 2:
        return <NominationStepB />;
      // case 3:
      //   return <NominationStepC />;
      // case 4:
      //   return <NominationStepD />;
      // case 5:
      //   return <NominationStepE />;
      default:
        return <NominationStepA />;
    }
  };

  // TODO: Add a progress bar or step indicator
  const totalSteps = 5; // Or dynamically calculate based on available steps

  return (
    <div className="w-full max-w-3xl mx-auto bg-tpahla-darkgreen/80 backdrop-blur-sm p-8 md:p-12 rounded-xl shadow-2xl border border-tpahla-gold/20">
      <div className="mb-8">
        <h2 className="text-3xl font-serif font-bold text-tpahla-gold text-center mb-2">Submit Your Nomination</h2>
        <p className="text-center text-gray-400">Complete all sections to submit your nomination for TPAHLA 2025.</p>
        <div className="mt-4">
          <div className="bg-tpahla-neutral-dark h-2 rounded-full w-full">
            <div 
              className="bg-tpahla-gold h-2 rounded-full transition-all duration-500 ease-in-out" 
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            ></div>
          </div>
          <p className="text-sm text-tpahla-gold text-center mt-2">Step {currentStep} of {totalSteps}</p>
        </div>
      </div>
      {renderStep()}
    </div>
  );
};

export default NominationFormWrapper;
