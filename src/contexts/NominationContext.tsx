
import React, { createContext, useState, useContext, ReactNode } from 'react';
import { NominationStepAData, NominationStepBData, NominationStepCData, NominationStepDData, NominationStepEData } from '@/lib/validators/nominationValidators';

interface NominationData {
  sectionA?: NominationStepAData;
  sectionB?: NominationStepBData;
  sectionC?: NominationStepCData;
  sectionD?: NominationStepDData;
  sectionE?: NominationStepEData; 
}

interface NominationContextType {
  nominationId: string | null;
  setNominationId: (id: string | null) => void;
  currentStep: number;
  setCurrentStep: (step: number) => void;
  nominationData: NominationData;
  updateSectionData: (section: keyof NominationData, data: any) => void;
  resetNomination: () => void;
  isSubmittingNomination: boolean; // Added for global submission state
  setIsSubmittingNomination: (isSubmitting: boolean) => void; // Added
}

const NominationContext = createContext<NominationContextType | undefined>(undefined);

export const NominationProvider = ({ children }: { children: ReactNode }) => {
  const [nominationId, setNominationId] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [nominationData, setNominationData] = useState<NominationData>({});
  const [isSubmittingNomination, setIsSubmittingNomination] = useState(false);


  const updateSectionData = (section: keyof NominationData, data: any) => {
    setNominationData(prevData => {
      const updatedData = {
        ...prevData,
        [section]: data,
      };
      console.log(`NominationContext: Updated ${section}`, data);
      console.log('NominationContext: Full data after update', updatedData);
      return updatedData;
    });
  };

  const resetNomination = () => {
    setNominationId(null);
    setCurrentStep(1);
    setNominationData({});
    setIsSubmittingNomination(false);
    // Potentially clear localStorage if used for persistence
  };

  return (
    <NominationContext.Provider value={{
      nominationId,
      setNominationId,
      currentStep,
      setCurrentStep,
      nominationData,
      updateSectionData,
      resetNomination,
      isSubmittingNomination,
      setIsSubmittingNomination,
    }}>
      {children}
    </NominationContext.Provider>
  );
};

export const useNomination = () => {
  const context = useContext(NominationContext);
  if (context === undefined) {
    throw new Error('useNomination must be used within a NominationProvider');
  }
  return context;
};
