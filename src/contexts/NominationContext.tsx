
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
  loadExistingNomination: (nominationId: string, nominationData: any) => void; // Added for loading existing nominations
}

const NominationContext = createContext<NominationContextType | undefined>(undefined);

export const NominationProvider = ({ children }: { children: ReactNode }) => {
  const [nominationId, setNominationId] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [nominationData, setNominationData] = useState<NominationData>({});
  const [isSubmittingNomination, setIsSubmittingNomination] = useState(false);


  const loadExistingNomination = (id: string, data: any) => {
    setNominationId(id);
    
    // Load existing form data
    if (data.form_section_a) {
      updateSectionData('sectionA', data.form_section_a);
    }
    if (data.form_section_b) {
      updateSectionData('sectionB', data.form_section_b);
    }
    if (data.form_section_c) {
      updateSectionData('sectionC', data.form_section_c);
    }
    if (data.form_section_d) {
      updateSectionData('sectionD', data.form_section_d);
    }
    if (data.form_section_e) {
      updateSectionData('sectionE', data.form_section_e);
    }

    // Determine which step to start from based on completed sections
    let nextStep = 1;
    if (data.form_section_a) nextStep = 2;
    if (data.form_section_b) nextStep = 3;
    if (data.form_section_c) nextStep = 4;
    if (data.form_section_d) nextStep = 5;
    
    setCurrentStep(nextStep);
  };

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
      loadExistingNomination,
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
