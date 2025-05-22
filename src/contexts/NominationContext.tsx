import React, { createContext, useState, useContext, ReactNode } from 'react';
import { NominationStepAData } from '@/lib/validators/nominationValidators';
// Import other step data types as they are created

interface NominationData {
  sectionA?: NominationStepAData;
  // sectionB?: NominationStepBData;
  // ... other sections
}

interface NominationContextType {
  nominationId: string | null;
  setNominationId: (id: string | null) => void;
  currentStep: number;
  setCurrentStep: (step: number) => void;
  nominationData: NominationData;
  updateSectionData: (section: keyof NominationData, data: any) => void;
  resetNomination: () => void;
}

const NominationContext = createContext<NominationContextType | undefined>(undefined);

export const NominationProvider = ({ children }: { children: ReactNode }) => {
  const [nominationId, setNominationId] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [nominationData, setNominationData] = useState<NominationData>({});

  const updateSectionData = (section: keyof NominationData, data: any) => {
    setNominationData(prevData => ({
      ...prevData,
      [section]: data,
    }));
  };

  const resetNomination = () => {
    setNominationId(null);
    setCurrentStep(1);
    setNominationData({});
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
      resetNomination
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
